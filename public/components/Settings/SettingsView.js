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
        let deletePhotoBtn = this.root.querySelector('.delete-btn');
        let addPhotoBtn = this.root.querySelector('.add-btn');
        deletePhotoBtn.addEventListener('click', this.eventBus.emit(SETTINGS_EVENTS.DELETE_PHOTO));
        addPhotoBtn.addEventListener('click', this.eventBus.emit(SETTINGS_EVENTS.ADD_PHOTO, ))
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
            inputsValue[input.id] = input.value;
        });
        inputsValue.prefer_gender=="Мужчин"?inputsValue.prefer_gender=1:inputsValue.prefer_gender=0;
        inputsValue.user_gender=="Мужской"?inputsValue.user_gender=1:inputsValue.user_gender=0;
        this.eventBus.emit(SETTINGS_EVENTS.SEND_DATA, inputsValue);
    }

}
