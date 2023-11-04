import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {SETTINGS_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент страницы авторизации (входа)
 */
export class SettingsView extends BaseView {
    constructor(root, eventBus, tmpl) {
        super(root, eventBus, tmpl);
        this.eventBus.on(SETTINGS_EVENTS.GOT_USER, this.render.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_UPLOADED, this.updatePhoto.bind(this));
        this.root = root;
    }

    render(data) {
        super.render(data);
        this.form = this.root.querySelector('.settingsForm');
        this.form.addEventListener('submit', this.onSubmit.bind(this));

        const deletePhotoBtn = this.root.querySelector('.delete-btn');
        const selectedFile = document.querySelector('#file');
        this.photoPlace = document.querySelector('#user-photo');
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';

        deletePhotoBtn.addEventListener('click', this.eventBus.emit(SETTINGS_EVENTS.DELETE_PHOTO));
        // selectedFile.addEventListener('change', console.log(selectedFile.files[0]));

        function addPhoto(eventBus) {
            return function() {
                eventBus.emit(SETTINGS_EVENTS.ADD_PHOTO, selectedFile.files[0]);
            };
        }

        const add = addPhoto(this.eventBus);

        selectedFile.onchange = function() {
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
        const inputsValue = {};
        selectors.forEach((selector) => {
            inputsValue[selector.id] = selector[selector.selectedIndex].text;
        });
        inputs.forEach((input) => {
            inputsValue[input.id] = input.value;
        });
        inputsValue.prefer_gender === 'Мужчин' ? inputsValue.prefer_gender = 1 : inputsValue.prefer_gender = 0;
        inputsValue.user_gender === 'Мужской' ? inputsValue.user_gender = 1 : inputsValue.user_gender = 0;
        this.eventBus.emit(SETTINGS_EVENTS.SEND_DATA, inputsValue);
    }

    updatePhoto(photo) {
        this.photoPlace.src = photo;
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
        if (document.querySelector('#age').value === '') {
            this.showError('Поле возраста не должно быть пусто');
            return false;
        }
        if (isNaN(Number(document.querySelector('#age').value))) {
            this.showError('В поле возраста должно быть число');
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
