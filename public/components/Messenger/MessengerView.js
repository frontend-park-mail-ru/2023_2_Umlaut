import {BaseView} from '../BaseView.js';
import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import './Messenger.scss';

export class MessengerView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Messenger.hbs'));
        this.eventBus.on(MESSENGER_EVENTS.DIALOGS_READY, this.addDialogs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.PAIRS_READY, this.addPairs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.MESSAGES_READY, this.openDialog.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.NEW_MESSAGE_IN_THIS_DIALOG, this.createMessage.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.NEW_MESSAGE_IN_OTHER_DIALOG, this.newMessageOtherDialog.bind(this));
        this.dialogPreviewTemplate = require('./DialogPreview.hbs');
        this.dialog = require('./MessengerWindow.hbs');
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
        this.message = require('./Message.hbs');
        this.eventBus.on();
        this.my_id = 0;
    }

    render(data) {
        super.render(data);

        this.dialogList = [];
        this.dialogListView = document.getElementById('dialog-list');
        this.dialogWindow = document.getElementById('dialog-window');

        // this.dialogWindow.innerHTML = this.dialog();

        this.showDialogs = document.getElementById('show_dialogs');
        this.showPairs = document.getElementById('show_pairs');

        this.showDialogs.addEventListener('click', () => this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS));
        this.showPairs.addEventListener('click', () => this.eventBus.emit(MESSENGER_EVENTS.GET_PAIRS));

        if (!data) {
            this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS);
        }
    }

    addDialogs(data) {
        if (data) {
            this.addData(data);
        } else {
            this.addEmptyDialogs(require('./EmptyDialogs.hbs'));
        }
    }

    addPairs(data) {
        if (data) {
            this.addData(data);
        } else {
            this.addEmptyDialogs(require('./EmptyPairs.hbs'));
        }
    }

    addData(data) {
        this.dialogList = [];
        this.dialogListView.innerHTML = '';
        data.forEach((dialog) => {
            const dialogPreview = document.createElement('div');
            dialogPreview.innerHTML = this.dialogPreviewTemplate(dialog);
            if (dialog.last_message !== null && !dialog.last_message.is_read) {
                this.newMessageOtherDialog(dialog.last_message);
            }
            dialogPreview.addEventListener('click', ()=>{
                this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES, dialog.user_dialog_id);
            });
            this.dialogListView.appendChild(dialogPreview);
            this.dialogList.push(dialogPreview);
        });
    }

    addEmptyDialogs(empty) {
        this.dialogListView.innerHTML = '';
        const dialogPreview = document.createElement('div');
        dialogPreview.innerHTML = empty();
        this.dialogListView.appendChild(dialogPreview);
        this.dialogList.push(dialogPreview);
    }

    openDialog(data) {
        this.dialogWindow.innerHTML = this.dialog();
        this.my_id = data.my_id;
        data.dialogs.forEach((mes) => {
            mes.created_at = mes.created_at.slice(mes.created_at.indexOf('T') + 1,
                this.nthIndex(mes.created_at, ':', 2));
            this.createMessage(mes);
        });
        const send = this.dialogWindow.querySelector('#send');
        send.addEventListener('click', ()=>{
            const inputText = this.dialogWindow.querySelector('#message');
            const msg = inputText.value;
            inputText.value = '';
            this.eventBus.emit(MESSENGER_EVENTS.SEND_MESSAGE, msg);
            const date = new Date();
            this.createMessage({
                message_text: msg,
                created_at: `${date.getHours()}:${date.getMinutes()}`,
                sender_id: this.my_id});
        });
    }

    createMessage(mes) {
        if (!mes.is_read) {
            const unread = document.createElement('div');
            unread.className = 'dialog-window__unread';
            this.root.querySelector('.dialog-window__dialog').appendChild(unread);
        }
        const mesElem = document.createElement('div');
        mesElem.innerHTML = this.message({text: mes.message_text, time: mes.created_at});
        if (mes.sender_id === this.my_id) {
            const myMes = mesElem.querySelector('.dialog-window__message');
            myMes.className = 'dialog-window__message dialog-window__message_me';
        }
        this.root.querySelector('.dialog-window__dialog').appendChild(mesElem);
    }

    newMessageOtherDialog(msg) {
        const id = `${msg.dialog_id}_${msg.sender_id}`;
        const dialog = document.getElementById(id);
        const newMes = document.createElement('div');
        newMes.className = 'messenger__new-message';
        dialog.appendChild(newMes);
    }

    close() {
        super.close();
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
    }


    nthIndex(str, pat, n) {
        const L = str.length; let i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }
}
