import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {AUTH_EVENTS, COMMON_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент страницы регистрации
 */
export class SignupView extends BaseView {
    errorLabel;
    mailInput;
    nameInput;
    passwordInput;
    repasswordInput;
    form;
    constructor(root, eventBus) {
        super(root, eventBus, require('./Signup.hbs'));
        this.eventBus.on( AUTH_EVENTS.INVALID_AUTH, (data) => this.showError(data.message));
        this.eventBus.on( COMMON_EVENTS.UNAUTH, this.render.bind(this));
    }

    /**
     * Отрисовка страницы регистрации из шаблона
     */
    render() {
        super.render();
        this.form = this.root.querySelector('.auth');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';
        this.mailInput = this.form.querySelector('#mail');
        this.nameInput = this.form.querySelector('#name');
        this.passwordInput = this.form.querySelector('#password');
        this.repasswordInput = this.form.querySelector('#password-repeat');
        this.mailInput.addEventListener('change', () => {
            if (!Validate.email(this.mailInput.value)) {
                this.showError('Неверный email');
            } else this.hideError();
        });
        this.nameInput.addEventListener('change', () => {
            if (this.nameInput.value === '') {
                this.showError('Имя не должно быть пусто');
            } else this.hideError();
        });
        this.passwordInput.addEventListener('change', () => {
            if (this.passwordInput.value.length <= 5) {
                this.showError('Пароль должен быть длиннее 5-ти символов');
            } else this.hideError();
        });
        this.repasswordInput.addEventListener('change', () => {
            if (this.passwordInput.value !== this.repasswordInput.value) {
                this.showError('Пароли отличаются');
            } else this.hideError();
        });

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
        });
    }

    /**
     * Закрытие страницы регистрации
     */
    close() {
        super.close();
        this.mailInput = null;
        this.nameInput = null;
        this.passwordInput = null;
        this.repasswordInput = null;
        this.form = null;
    }

    /**
     * Проверка правильности введенноых данных
     * @return {boolean} правильный или нет
     */
    validateForm() {
        if (!Validate.email(this.mailInput.value)) {
            this.showError('Неверный email');
            this.mailInput.focus();
            return false;
        }
        if (this.nameInput.value === '') {
            this.showError('Имя не должно быть пусто');
            this.nameInput.focus();
            return false;
        }
        if (!Validate.onlyLetters(this.nameInput.value)) {
            this.showError('Имя может содержать только буквы');
            this.nameInput.focus();
            return false;
        }
        if ( this.passwordInput.value.length <= 5) {
            this.showError('Пароль должен быть длиннее 5-ти символов');
            this.passwordInput.focus();
            return false;
        }
        if ( Validate.areSmails(this.passwordInput.value)) {
            this.showError('Пароль не может содержать смайлики');
            this.passwordInput.focus();
            return false;
        }
        if (this.passwordInput.value !== this.repasswordInput.value) {
            this.showError('Пароли отличаются');
            return false;
        }
        return true;
    }

    /**
     * Отправка данных с формы регистрации
     * @param {SubmitEvent} event
     */
    onSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const inputsValue = {};

        inputsValue[this.mailInput.id] = this.mailInput.value;
        inputsValue[this.nameInput.id] = this.nameInput.value;
        inputsValue[this.passwordInput.id] = this.passwordInput.value;

        this.eventBus.emit(AUTH_EVENTS.SIGN_UP, inputsValue);
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
