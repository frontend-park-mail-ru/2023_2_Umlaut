import {Validate} from '../../lib/validate.js';
import {BaseView} from '../BaseView.js';
import {AUTH_EVENTS} from '../../lib/constansts.js';
import './Auth.scss';

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
        const eye = this.root.querySelector('#eye');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.errorLabel = this.form.querySelector('.error-label');
        this.errorLabel.style.visibility = 'hidden';
        this.mailInput = this.form.querySelector('#mail');
        this.mailInput.addEventListener('change', this.validateMail.bind(this));

        eye.addEventListener('click', () => {
            var x = document.getElementById("password");
            if (x.type === "password") {
                x.type = "text";
                eye.src = '/pics/eye.png';
            } else {
                x.type = "password";
                eye.src = '/pics/eye_closed.png';
            }
            }
        );
    }

    close() {
        this.form = null;
        this.mailInput = null;
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
