import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {POPUP_EVENTS, SETTINGS_EVENTS} from '../../lib/constansts.js';
import { DEFAULT_PHOTO } from '../../lib/constansts.js';
import './Settings.scss';

/**
 * Компонент страницы авторизации (входа)
 */
export class SettingsView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Settings.hbs'));
        this.eventBus.on(SETTINGS_EVENTS.GOT_USER, this.render.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_UPLOADED, this.updatePhoto.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.ERROR, this.showError.bind(this));
        this.eventBus.on(SETTINGS_EVENTS.HIDE, this.hideError.bind(this));
        this.root = root;
    }

    render(data) {
        super.render(data);

        this.form = this.root.querySelector('.settings-form');
        this.form.addEventListener('submit', this.onSubmit.bind(this));

        const deletePhotoBtn = this.root.querySelector('.settings-form__button-delete');
        const selectedFile = document.querySelector('#file');
        const logoutBtn = document.querySelector('#logout');
        this.photoPlace = document.querySelector('#user-photo');
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';

        // deletePhotoBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.DELETE_PHOTO));
        // logoutBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.LOGOUT));

        const log = {func:() => {this.eventBus.emit(SETTINGS_EVENTS.LOGOUT);this.eventBus.emit(SETTINGS_EVENTS.HIDE);},
                    text: "Вы уверены, что хотите выйти?"}
        const del = {func:() => {this.eventBus.emit(SETTINGS_EVENTS.DELETE_PHOTO);this.eventBus.emit(SETTINGS_EVENTS.HIDE);},
                    text:"Вы уверены, что хотите удалить фото?"}
        logoutBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.SHOW_CONFIRM_LOG, log));
        deletePhotoBtn.addEventListener('click', () => this.eventBus.emit(SETTINGS_EVENTS.SHOW_CONFIRM_LOG, del));

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
        this.form = null;
        super.close();
    }

    /**
     * Проверка правильности введенных данных, отправка запроса на бекенд и переход в ленту/сообщение об ошибке
     * @param {SubmitEvent} event
     */
    onSubmit(event) {
        this.hideError();
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


    updatePhoto(image) {
        if (image !== DEFAULT_PHOTO) {
            this.photoPlace.src = image + `?random=${Date.now()}`;
        } else {
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
        if (!/^[a-zA-Zа-яА-я]/.test(document.querySelector('#name').value)){
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
        if (Date.parse(document.querySelector('#birthday').value) - new Date(1907, 1, 1)<0) {
            this.showError('Самому старому человеку в мире 116 лет, вам не может быть больше');
            return false;
        }
        if (Date.now() - Date.parse(document.querySelector('#birthday').value)<0) {
            this.showError('Извините, кажется вы еще не родились, чтобы знакомиться');
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
