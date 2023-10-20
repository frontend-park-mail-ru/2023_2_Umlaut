import {Api} from '../../lib/api.js';
import {Validate} from '../../lib/validate.js';

/**
 * Компонент страницы регистрации
 */
export class Signup {
    errorLabel;
    mailInput;
    nameInput;
    passwordInput;
    repasswordInput;
    parent;
    router;
    form;
    constructor(router) {
        this.parent = document.getElementById('root');
        this.router = router;
        this.form = null;
    }

    /**
     * Отрисовка страницы регистрации из шаблона
     */
    async render() {
        const resp = await Api.user();
        if ( resp.status === 200 ) {
            this.router.go('/feed');
            return;
        }
        this.parent.innerHTML = window.Handlebars.templates['Signup.hbs']();
        this.form = this.parent.querySelector('.auth');
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
        if ( this.passwordInput.value.length <= 5) {
            this.showError('Пароль должен быть длиннее 5-ти символов');
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
     * Отправка запроса на бекенд и переход в ленту/сообщение об ошибке
     * @param {SubmitEvent} event
     */
    onSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const inputsValue = {};

        inputsValue[this.mailInput.id] = this.mailInput.value;
        inputsValue[this.nameInput.id] = this.nameInput.value;
        inputsValue[this.passwordInput.id] = this.passwordInput.value;

        Api.signup(inputsValue).then((response) => {
            if (response.status === 200) this.router.go('/feed');
            else this.showError(response.body.message);
        });
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
