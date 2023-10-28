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
        this.root = root;
    }

    render(data) {
        super.render(data);
        this.form = this.root.querySelector('.settingsForm');
        this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    close() {
        super.close();
        this.form.removeEventListener(this.onSubmit.bind(this));
        //this.mailInput.removeEventListener(this.validateMail.bind(this));
    }

    /**
     * Проверка правильности введенных данных, отправка запроса на бекенд и переход в ленту/сообщение об ошибке
     * @param {SubmitEvent} event
     */
    onSubmit(event) {
        event.preventDefault();

        const selectors = this.form.querySelectorAll('select');
        const inputs = this.form.querySelectorAll('textarea');
        const inputsValue = {};
        selectors.forEach((selector) => {
            inputsValue[selector.id] = selector[selector.selectedIndex].text;
        });
        inputs.forEach((input) => {
            inputsValue[input.id] = input.textContent;
        });

        this.eventBus.emit(SETTINGS_EVENTS.SEND_DATA, inputsValue);
    }

}
