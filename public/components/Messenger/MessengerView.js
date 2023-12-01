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
        this.eventBus.on(MESSENGER_EVENTS.SENT, this.createMessage.bind(this));
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
        this.forMobile();
        this.dialogList = [];
        this.dialogListView = document.getElementById('dialog-list');
        this.dialogWindow = document.getElementById('dialog-window');

        this.showDialogs = document.getElementById('show_dialogs');
        this.showPairs = document.getElementById('show_pairs');
        this.showDialogs.addEventListener('click', () => this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS));
        this.showPairs.addEventListener('click', () => this.eventBus.emit(MESSENGER_EVENTS.GET_PAIRS));

        if (!data) {
            this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS);
        }

        this.forMobile();
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
                const newMes = document.createElement('div');
                newMes.className = 'dialog-preview__new-message';
                dialogPreview.querySelector('.dialog-preview').appendChild(newMes);
            }

            dialogPreview.addEventListener('click', ()=>{
                this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES, {id: dialog.user_dialog_id, name: dialog.companion});
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
        const newMes = this.root.querySelector('.dialog-preview__new-message');
        if (newMes) {
            newMes.style.visibility = 'hidden';
        }

        this.dialogWindow.innerHTML = this.dialog({name: data.name});
        this.my_id = data.my_id;
        data.dialogs.forEach((mes) => {
            mes.created_at = mes.created_at.slice(mes.created_at.indexOf('T') + 1,
                this.nthIndex(mes.created_at, ':', 2));
            this.createMessage(mes);
        });

        const inputText = this.dialogWindow.querySelector('#message');
        inputText.onfocus = () => {
            const windowDialog = this.root.querySelector('.dialog-window__dialog');
            const unread = this.root.querySelector('.dialog-window__unread');
            if (unread) {
                windowDialog.removeChild(unread);
            }
        };

        const send = this.dialogWindow.querySelector('#send');
        send.addEventListener('click', ()=>{
            const inputText = this.dialogWindow.querySelector('#message');
            const msg = inputText.value;
            inputText.value = '';
            if(msg.length>0)
                this.eventBus.emit(MESSENGER_EVENTS.SEND_MESSAGE, msg);
        });

        this.dialogWindow.querySelector('#message')
            .addEventListener('keyup', (event) => {
                event.preventDefault();
                if (event.keyCode === 13) {
                    document.getElementById('send').click();
                }
            });

        const block = this.root.querySelector('.dialog-window__dialog');
        block.scrollTop = block.scrollHeight;

        this.eventBus.emit(MESSENGER_EVENTS.MARK_AS_READ, data.dialogs);
    }

    createMessage(mes) {
        const windowDialog = this.root.querySelector('.dialog-window__dialog');
        if (!windowDialog) {
            return;
        }

        if (!mes.is_read && !this.root.querySelector('.dialog-window__unread') && (mes.sender_id !== this.my_id)) {
            const unread = document.createElement('div');
            unread.className = 'dialog-window__unread';
            unread.textContent = 'Непрочитанные сообщения';
            windowDialog.appendChild(unread);
        }

        const mesElem = document.createElement('div');
        mesElem.innerHTML = this.message({text: mes.message_text, time: mes.created_at});
        if (mes.sender_id === this.my_id) {
            const myMes = mesElem.querySelector('.dialog-window__message');
            myMes.className = 'dialog-window__message dialog-window__message_me';
        }
        const block = this.root.querySelector('.dialog-window__dialog');
        block.scrollTop = block.scrollHeight;
        windowDialog.appendChild(mesElem);
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

    newMessageOtherDialog() {
        const dialog = this.root.querySelector('.dialog-preview');
        if (!dialog) {
            return;
        }
        const newMes = document.createElement('div');
        newMes.className = 'dialog-preview__new-message';
        dialog.appendChild(newMes);
    }

    forMobile() {
        const dialogs = this.root.querySelector('.messenger__dialogs');
        dialogs.addEventListener('click', ()=>{
            const mesSwitch = dialogs.querySelector('.messenger__switch');
            mesSwitch.style.display = 'block';
            const names = dialogs.querySelectorAll('.dialog-preview__dialog-name');
            names.forEach((name) => {
                name.style.display = 'block';
            });
            const dialList = dialogs.querySelector('.messenger__dialog-list');
            dialList.style.width = 'auto';

            dialogs.style.width = '350px';
        });

        const dialogWindow = this.root.querySelector('.dialog-window');
        dialogWindow.addEventListener('click', ()=>{
            const dialogs = this.root.querySelector('.messenger__dialogs');
            const mesSwitch = dialogs.querySelector('.messenger__switch');
            mesSwitch.style.display = 'none';
            const names = dialogs.querySelectorAll('.dialog-preview__dialog-name');
            names.forEach((name) => {
                name.style.display = 'none';
            });
            const dialList = dialogs.querySelector('.messenger__dialog-list');
            dialList.style.width = 'min-content';

            dialogs.style.width = 'min-content';
        });
    }
}
