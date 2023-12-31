import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {SETTINGS_EVENTS} from '../../lib/constansts.js';
import './Settings.scss';
import {Carousel} from '../Carousel/Carousel.js';

/**
 * Класс отображения страницы натроек
 */
export class SettingsView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Settings.hbs'));
        this.eventBus.on(SETTINGS_EVENTS.GOT_USER, this.render.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_UPLOADED, this.addPhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.ERROR, this.showError.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.HIDE, this.hideError.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_DELETED, this.deletePhoto.bind(this));
        this.root = root;
    }

    /**
     * Рендер страницы настроек
     * @param {Object} data - старые настройки пользователя
     */
    render(data) {
        super.render(data);
        document.querySelector('.sidebar').className = 'sidebar';
        for (let i = 0; i < data.user.tags.length; i++) {
            const elem = this.root.querySelector(`#${data.interests[data.user.tags[i]]}`);
            elem.classList.add('multiselection__selection_active');
        }

        this.changeTextareaHeight();

        this.selectTags();

        this.form = this.root.querySelector('.settings-form');
        this.form.addEventListener('submit', this.onSubmit.bind(this));

        this.deletePhotoBtn = this.root.querySelector('.settings-form__button-delete');
        const selectedFile = document.querySelector('#file');
        const logoutBtn = document.querySelector('#logout');
        const photoPlace = document.querySelector('.settings-form__photo');
        this.photoCarousel = new Carousel(photoPlace);
        this.photoCarousel.render(data.user.image_paths);
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';

        function addPhoto(eventBus) {
            return function() {
                eventBus.emit(SETTINGS_EVENTS.ADD_PHOTO, selectedFile.files[0]);
            };
        }

        const add = addPhoto(this.eventBus);

        selectedFile.onchange = ()=> {
            add();
        };

        const log = {func: () => {
            this.eventBus.emit(SETTINGS_EVENTS.LOGOUT); this.eventBus.emit(SETTINGS_EVENTS.HIDE);
        },
        text: 'Вы уверены, что хотите выйти?'};

        const del = {func: () => {
            this.eventBus.emit(SETTINGS_EVENTS.DELETE_PHOTO, this.photoCarousel.current());
            this.eventBus.emit(SETTINGS_EVENTS.HIDE);
        },
        text: 'Вы уверены, что хотите удалить фото?'};

        logoutBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.SHOW_CONFIRM_LOG, log));
        this.deletePhotoBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.SHOW_CONFIRM_LOG, del));
        if (data.user.image_paths.length === 0) {
            this.deletePhotoBtn.disabled = true;
        }


        const eye = this.root.querySelector('#eye');
        eye.addEventListener('click', () => {
            const x = document.getElementById('password');
            if (x.type === 'password') {
                x.type = 'text';
                eye.src = '/pics/eye.png';
            } else {
                x.type = 'password';
                eye.src = '/pics/eye_closed.png';
            }
        },
        );
    }

    /**
     * Меняет высоту textarea при вводе текста
     */
    changeTextareaHeight() {
        const tx = document.getElementsByTagName('textarea');
        for (let i = 0; i < tx.length; i++) {
            tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
            tx[i].addEventListener('input', OnInput, false);
        }

        function OnInput() {
            this.style.height = 0;
            this.style.height = (this.scrollHeight) + 'px';
        }
    }

    /**
     * Закрытие страницы настроек
     */
    close() {
        this.form = null;
        document.removeEventListener('click', this.clickWithinDiv);
        super.close();
    }

    /**
     * Проверка правильности введенных данных, отправка запроса на бекенд
     * @param {SubmitEvent} event
     */
    onSubmit(event) {
        this.hideError();
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const tags = this.form.querySelectorAll('.multiselection__selection_active');
        const selectors = this.form.querySelectorAll('select');
        const inputs = this.form.querySelectorAll('textarea');
        const birthdayInput = this.form.querySelector('#birthday');
        const password = this.form.querySelector('#password');
        const inputsValue = {};
        inputsValue.tags = [];
        selectors.forEach((selector) => {
            inputsValue[selector.id] = selector[selector.selectedIndex].text;
        });
        inputs.forEach((input) => {
            inputsValue[input.id] = input.value;
        });
        tags.forEach((tag) => {
            inputsValue.tags.push(tag.innerHTML);
        });
        inputsValue.birthday = new Date(birthdayInput.value);
        inputsValue.password = password.value;
        if (inputsValue.prefer_gender === 'Мужчин' && inputsValue.prefer_gender !== null) {
            inputsValue.prefer_gender = 1;
        } else {
            inputsValue.prefer_gender = 0;
        }

        if (inputsValue.user_gender = inputsValue.user_gender === 'Мужской' && inputsValue.user_gender !== null) {
            inputsValue.user_gender = 1;
        } else {
            inputsValue.user_gender = 0;
        }

        this.eventBus.emit(SETTINGS_EVENTS.SEND_DATA, inputsValue);
    }

    /**
     * Добавить фото пользователя
     * @param {Object} image - файл фотографии
     */
    addPhoto(image) {
        this.photoCarousel.add(image);
        if (this.photoCarousel.current() !== '') {
            this.deletePhotoBtn.disabled = false;
        }
    }

    /**
     * Удалить фото пользователя
     * @param {String} photo - ссылка на фото
     */
    deletePhoto(photo) {
        this.photoCarousel.delete(photo);
        if (this.photoCarousel.current() === '') {
            this.deletePhotoBtn.disabled = true;
        }
    }

    /**
     * Проверка правильности введенных данных
     * @return {boolean} правильность введенных данных
     */
    validateForm() {
        if (!Validate.email(document.querySelector('#mail').value)) {
            this.showError('Неверный email');
            return false;
        }
        if (document.querySelector('#name').value === '') {
            this.showError('Имя не должно быть пусто');
            return false;
        }
        if (!Validate.onlyLetters(document.querySelector('#name').value)) {
            this.showError('Имя может содержать только буквы');
            return false;
        }
        if (document.querySelector('#description').value === '') {
            this.showError('Заполните поле о себе');
            return false;
        }
        if (document.querySelector('#birthday').value === '') {
            this.showError('Введите свою дату рождения');
            return false;
        }
        const uGender = document.querySelector('#user_gender');
        if (uGender[uGender.selectedIndex].text === '') {
            this.showError('Введите свой пол');
            return false;
        }
        const prGender = document.querySelector('#prefer_gender');
        if (prGender[prGender.selectedIndex].text === '') {
            this.showError('Выберите предпочитаемый пол');
            return false;
        }
        if (isNaN(Date.parse(document.querySelector('#birthday').value))) {
            this.showError('Проверьте правильность введенной даты рождения');
            return false;
        }
        if (Date.parse(document.querySelector('#birthday').value) - new Date(1907, 1, 1) < 0) {
            this.showError('Самому старому человеку в мире 116 лет, вам не может быть больше');
            return false;
        }
        if (Date.now() - Date.parse(document.querySelector('#birthday').value) < 0) {
            this.showError('Извините, кажется вы еще не родились, чтобы знакомиться');
            return false;
        }
        if ( document.querySelector('#password').value.length <= 5 &&
             document.querySelector('#password').value.length > 0) {
            this.showError('Пароль должен быть длиннее 5-ти символов');
            return false;
        }
        if ( Validate.areSmails(document.querySelector('#password').value) &&
             document.querySelector('#password').value.length > 0) {
            this.showError('Пароль не должен содержать смайлики');
            return false;
        }
        if (document.querySelector('#repeat-password').value !== document.querySelector('#password').value) {
            this.showError('Пароли отличаются');
            return false;
        }
        if (this.form.querySelectorAll('.multiselection__selection_active').length > 6) {
            this.showError('Выберите не более 6 тегов');
            return false;
        }
        return true;
    }

    /**
     * Скрыть сообщение об ошибке
     */
    hideError() {
        this.errorLabel.style.visibility = 'hidden';
    }

    /**
     * Показать сообщение об ошибке
     * @param {string} message - сообщение
     */
    showError(message) {
        this.errorLabel.style.visibility = 'visible';
        this.errorLabel.innerHTML = message;
    }

    /**
     * Закрытие окна с тегами по клику вне него
     * @param {event} e - событие клика
     */
    clickWithinDiv(e) {
        const container = document.querySelector('.multiselection__input');
        const input = document.querySelector('.multiselection__select-multiple');
        if (!container.contains(e.target) && !input.contains(e.target)) {
            input.style.visibility = 'hidden';
        }
    }

    /**
     * Отрисовка выбора тегов
     */
    selectTags() {
        const input = this.root.querySelector('.multiselection__input');
        input.addEventListener('click', ()=>{
            const tagsInput = document.querySelector('.multiselection__select-multiple');
            tagsInput.style.visibility = 'visible';
            console.log('click');
        });
        document.addEventListener('click', this.clickWithinDiv);

        const selected = this.root.querySelector('.multiselection__selected');
        const list = this.root.querySelectorAll('.multiselection__selection_variant');
        for (let i = 0; i < list.length; i++) {
            list[i].addEventListener('click', () => {
                list[i].classList.toggle('multiselection__selection_active');
                if (list[i].classList.contains('multiselection__selection_active')) {
                    const modifyTag = document.createElement('span');
                    modifyTag.className = 'multiselection__selection multiselection__selection_selected';
                    modifyTag.innerHTML = list[i].innerHTML;
                    selected.appendChild(modifyTag);
                } else {
                    const allTags = document.querySelectorAll('.multiselection__selection_selected');
                    allTags.forEach((element) => {
                        if (element.innerHTML === list[i].innerHTML) {
                            selected.removeChild(element);
                        }
                    });
                }
            });
        }
    }
}
