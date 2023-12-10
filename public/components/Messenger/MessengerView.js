import {BaseView} from '../BaseView.js';
import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import './Messenger.scss';

export class MessengerView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Messenger.hbs'));
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

    render() {
        super.render();
        this.dialogWindow = document.getElementById('dialog-window');
        this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES);
        document.querySelector('.sidebar').className = 'sidebar';
    }

    openDialog(data) {
        if (!data) {
            return;
        }
        const newMes = this.root.querySelector('.dialog-preview__new-message');
        if (newMes) {
            newMes.style.visibility = 'hidden';
        }

        this.dialogWindow.innerHTML = this.dialog({user: data.user});
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
            if (msg.trim().length > 0) {
                this.eventBus.emit(MESSENGER_EVENTS.SEND_MESSAGE, msg);
            }
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
}
