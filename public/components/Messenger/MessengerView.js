import {BaseView} from '../BaseView.js';
import {MESSENGER_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент страницы авторизации (входа)
 */
export class MessengerView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, window.Handlebars.templates['Messenger.hbs']);
        this.eventBus.on(MESSENGER_EVENTS.DIALOGS_READY, this.addDialogs.bind(this));
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
    }

    render(data) {
        super.render(data);
        this.dialogListView = document.getElementById('dialog-list');
        this.dialogWindow = document.getElementById('dialog-window');
        if (data === undefined) {
            this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS);
        }
    }

    addDialogs(data) {
        this.dialogList = [];
        data.dialogs.forEach((dialog) => {
            const dialogPreview = document.createElement('div');
            dialogPreview.innerHTML = window.Handlebars.templates['DialogPreview.hbs'](dialog);
            this.dialogListView.appendChild(dialogPreview);
            this.dialogList.push(dialogPreview);
        });
    }

    close() {
        super.close();
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
    }
}
