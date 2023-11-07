import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {SETTINGS_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент страницы авторизации (входа)
 */
export class SettingsView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Settings.hbs'));
        this.eventBus.on(SETTINGS_EVENTS.GOT_USER, this.render.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_UPLOADED, this.updatePhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.ERROR, this.showError.bind(this));
        this.root = root;
    }

    render(data) {
        super.render(data);
        this.form = this.root.querySelector('.settingsForm');
        this.form.addEventListener('submit', this.onSubmit.bind(this));

        const deletePhotoBtn = this.root.querySelector('.delete-btn');
        const selectedFile = document.querySelector('#file');
        const logoutBtn = document.querySelector('#logout');
        this.photoPlace = document.querySelector('#user-photo');
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';

        deletePhotoBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.DELETE_PHOTO));
        logoutBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.LOGOUT));

        function addPhoto(eventBus) {
            return function() {
                eventBus.emit(SETTINGS_EVENTS.ADD_PHOTO, selectedFile.files[0]);
            };
        }

        const add = addPhoto(this.eventBus);

        selectedFile.onchange = ()=> {
            add();
        };
    }

    close() {
        super.close();
        this.form.removeEventListener(this.onSubmit.bind(this));
        // this.mailInput.removeEventListener(this.validateMail.bind(this));
    }

    /**
     * Проверка правильности введенных данных, отправка запроса на бекенд и переход в ленту/сообщение об ошибке
     * @param {SubmitEvent} event
     */
    onSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const selectors = this.form.querySelectorAll('select');
        const inputs = this.form.querySelectorAll('textarea');
        const birthdayInput = this.form.querySelector('#birthday');
        const password = this.form.querySelector('#password');
        const inputsValue = {};
        selectors.forEach((selector) => {
            inputsValue[selector.id] = selector[selector.selectedIndex].text;
        });
        inputs.forEach((input) => {
            inputsValue[input.id] = input.value;
        });
        inputsValue.birthday = new Date(birthdayInput.value);
        inputsValue.password = password.value;
        inputsValue.prefer_gender === 'Мужчин' && inputsValue.prefer_gender!==null ? inputsValue.prefer_gender = 1 : inputsValue.prefer_gender = 0;
        inputsValue.user_gender === 'Мужской' && inputsValue.user_gender!==null ? inputsValue.user_gender = 1 : inputsValue.user_gender = 0;
        this.eventBus.emit(SETTINGS_EVENTS.SEND_DATA, inputsValue);
    }


    updatePhoto(image) {
        if(image!=='/pics/avatar.png'){
            this.photoPlace.src = image + `?random=${Date.now()}`;
        }else{
            this.photoPlace.src = image;
        }
    }

    validateForm() {
        if (!Validate.email(document.querySelector('#mail').value)) {
            this.showError('Неверный email');
            return false;
        }
        if (document.querySelector('#name').value === '') {
            this.showError('Имя не должно быть пусто');
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
        let uGender = document.querySelector('#user_gender');
        if (uGender[uGender.selectedIndex].text === '') {
            this.showError('Введите свой пол');
            return false;
        }
        let prGender = document.querySelector('#prefer_gender');
        if (prGender[prGender.selectedIndex].text === '') {
            this.showError('Выберите предпочитаемый пол');
            return false;
        }
        if (isNaN(Date.parse(document.querySelector('#birthday').value))) {
            this.showError('Проверьте правильность введенной даты рождения');
            return false;
        }
        if ( document.querySelector('#password').value.length <= 5 &&
             document.querySelector('#password').value.length > 0) {
            this.showError('Пароль должен быть длиннее 5-ти символов');
            return false;
        }
        if (document.querySelector('#repeat-password').value !== document.querySelector('#password').value) {
            this.showError('Пароли отличаются');
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
}
