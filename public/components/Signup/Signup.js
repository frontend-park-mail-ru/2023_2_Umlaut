import {Api} from '../../modules/api.js';
import {Validate} from '../../modules/validate.js';

export class Signup {
    errorLabel;
    mailInput;
    nameInput;
    passwordInput;
    repasswordInput;
    parent;
    submitCallback;
    form;
    constructor(parent = document.body, submitCallback = () => {}) {
        this.parent = parent;
        this.submitCallback = submitCallback;
        this.form = null;
    }

    async render() {
        const resp = await Api.user();
        if ( resp.status === 200 ) {
            this.submitCallback();
            return;
        }
        this.parent.innerHTML = Handlebars.templates['Signup.hbs']();
        this.form = this.parent.querySelector('.auth');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';
        this.mailInput = this.form.querySelector('#mail');
        this.nameInput = this.form.querySelector('#name');
        this.passwordInput = this.form.querySelector('#password');
        this.repasswordInput = this.form.querySelector('#password-repeat');
        this.mailInput.addEventListener('change', (ev) => {
            if (!Validate.email(this.mailInput.value)) {
                this.showError('Неверный email');
            } else this.hideError();
        });
        this.nameInput.addEventListener('change', (ev) => {
            if (this.nameInput.value === '') {
                this.showError('Имя не должно быть пусто');
            } else this.hideError();
        });
        this.passwordInput.addEventListener('change', (ev) => {
            if (this.passwordInput.value.length <= 5) {
                this.showError('Пароль должен быть длиннее 5-ти символов');
            } else this.hideError();
        });
        this.repasswordInput.addEventListener('change', (ev) => {
            if (this.passwordInput.value !== this.repasswordInput.value) {
                this.showError('Пароли отличаются');
            } else this.hideError();
        });
    }

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

    onSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const inputs = this.form.querySelectorAll('input');
        const inputsValue = {};
        inputs.forEach((input) => {
            if (input.id !== 'password-repeat') inputsValue[input.id] = input.value;
        });

        Api.signup(inputsValue).then((response) => {
            if (response.status == 200) this.submitCallback();
            else this.showError(response.body.message);
        });
    }

    hideError() {
        this.errorLabel.style.visibility = 'hidden';
    }

    showError(message) {
        this.errorLabel.style.visibility = 'visible';
        this.errorLabel.innerHTML = message;
    }
}
