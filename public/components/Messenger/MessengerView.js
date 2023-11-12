import {BaseView} from '../BaseView.js';
import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import './Messenger.scss';

export class MessengerView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Messenger.hbs'));
        this.eventBus.on(MESSENGER_EVENTS.DIALOGS_READY, this.addDialogs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.PAIRS_READY, this.addDialogs.bind(this));
        this.dialogPreviewTemplate = require('./DialogPreview.hbs');
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
        this.showDialogs = document.getElementById('show_dialogs');
        this.showPairs = document.getElementById('show_pairs');

        this.showDialogs.addEventListener('click', () => this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS));
        this.showPairs.addEventListener('click', () => this.eventBus.emit(MESSENGER_EVENTS.GET_PAIRS));
    }

    addDialogs(data) {
        this.dialogList = [];
        this.dialogListView.innerHTML = '';
        data.forEach((dialog) => {
            const dialogPreview = document.createElement('div');
            dialogPreview.innerHTML = this.dialogPreviewTemplate(dialog);
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
