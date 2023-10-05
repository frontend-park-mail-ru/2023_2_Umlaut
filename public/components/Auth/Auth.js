import {Api} from '../../modules/api.js';
import {Validate} from '../../modules/validate.js';

export class Auth {
    form;
    errorLabel;
    mailInput;
    parent;
    router;
    constructor(router) {
        this.parent = document.getElementById('root');
        this.router = router;
    }

    /**
     * Рендер страницы авторизации
     */
    async render() {
        const resp = await Api.user();
        if ( resp.status === 200 ) {
            this.router.go('/feed');
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

    /**
     * Проверка правильности введенного адреса электронной почты
     * @returns {bool} удовлетворяет ли адрес почты условиям
     */
    validateMail() {
        if (Validate.email(this.mailInput.value)) {
            this.hideError();
            return true;
        } else {
            this.showError('Неверный email');
            return false;
        }
    }

    /**
     * Проверка правильности введенных данных, отправка запроса на бекенд и переход в ленту/сообщение об ошибке
     * @param {event} event 
     */
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
                if (response.status == 200) {
                    this.router.go('/feed');
                } else if(response.status == 400) {
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

    /**
     * Скрыть сообщение об ошибке
     */
    hideError() {
        this.errorLabel.style.visibility = 'hidden';
    }

    /**
     * Показать сообщение об ошибке
     */
    showError(message) {
        this.errorLabel.style.visibility = 'visible';
        this.errorLabel.innerHTML = message;
    }
}
