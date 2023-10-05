import {Api} from '../../modules/api.js';
import {Validate} from '../../modules/validate.js';

export class Auth {
    form;
    errorLabel;
    mailInput;
    parent;
    submitCallback;
    constructor(parent = document.body, submitCallback = () => {}) {
        this.parent = parent;
        this.submitCallback = submitCallback;
    }

    async render() {
        const resp = await Api.user();
        if ( resp.status === 200 ) {
            this.submitCallback();
            return;
        }
        this.parent.innerHTML = Handlebars.templates['Auth.hbs']();
        this.form = this.parent.querySelector('.auth');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';
        this.mailInput = this.form.querySelector('#mail');
        this.mailInput.addEventListener('change', ()=>{
            this.validateMail();
        });
    }

    validateMail() {
        if (Validate.email(this.mailInput.value)) {
            this.hideError();
            return true;
        } else {
            this.showError('Неверный email');
            return false;
        }
    }

    onSubmit(event) {
        event.preventDefault();

        if ( !this.validateMail()) {
            return;
        }

        const inputs = this.form.querySelectorAll('input');
        const inputsValue = {};
        inputs.forEach((input) => {
            inputsValue[input.id] = input.value;
        });

        Api.login(inputsValue).then(
            (response) => {
                if (response.status === 200) {
                    this.submitCallback();
                } else if (response.status === 400) {
                    this.showError('Неправильный синтаксис запроса');
                } else if (response.status === 404) {
                    this.showError('Страница не найдена');
                } else if (response.status === 401) {
                    this.showError('Невeрный email или пароль');
                } else {
                    this.showError('Неожиданная ошибка');
                }
            },
        );
    }

    hideError() {
        this.errorLabel.style.visibility = 'hidden';
    }

    showError(message) {
        this.errorLabel.style.visibility = 'visible';
        this.errorLabel.innerHTML = message;
    }
}
