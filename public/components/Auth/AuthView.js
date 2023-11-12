import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {AUTH_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент страницы авторизации (входа)
 */
export class AuthView extends BaseView {
    form;
    errorLabel;
    mailInput;
    parent;
    router;
    constructor(root, eventBus) {
        super(root, eventBus, require('./Auth.hbs'));
        this.eventBus.on( AUTH_EVENTS.INVALID_AUTH, (data) => this.showError(data.message));
        this.eventBus.on( AUTH_EVENTS.UNAUTH, this.render.bind(this));
    }

    /**
     * Рендер страницы авторизации
     */
    render() {
        super.render();
        this.form = this.root.querySelector('.auth');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';
        this.mailInput = this.form.querySelector('#mail');
        this.mailInput.addEventListener('change', this.validateMail.bind(this));
    }

    close() {
        this.form.removeEventListener('submit', this.onSubmit.bind(this));
        this.mailInput.removeEventListener('change', this.validateMail.bind(this));
        super.close();
    }

    /**
     * Проверка правильности введенного адреса электронной почты
     * @return {bool} удовлетворяет ли адрес почты условиям
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
     * @param {SubmitEvent} event
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

        this.eventBus.emit(AUTH_EVENTS.SIGN_IN, inputsValue);
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
