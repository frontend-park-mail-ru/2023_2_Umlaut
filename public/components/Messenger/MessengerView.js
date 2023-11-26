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
        this.dialog = require("./MessengerWindow.hbs");
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
        this.message = require('./Message.hbs');
        this.eventBus.on()
    }

    render(data) {
        super.render(data);

        this.dialogList = [];
        this.dialogListView = document.getElementById('dialog-list');
        this.dialogWindow = document.getElementById('dialog-window');
        this.messagesPlace = this.root.querySelector('.dialog-window__dialog');

        const dialogs = this.root.querySelectorAll('.dialog-preview');
        dialogs.forEach(dialog => {
            dialog.addEventListener('click', ()=>this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES, dialog.id));
        });

        this.dialogWindow.innerHTML = this.dialog();

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

    openDialog(data){
        this.dialogWindow.innerHTML = this.dialog(data);
        data.forEach(mes => {
            this.createMessage(mes);
        });
        //todo get names from back
        const send = this.dialogWindow.querySelector("#send");
        const msg = this.dialogWindow.querySelector("#message").value;
        send.addEventListener('click', ()=>{ 
            this.eventBus.emit(MESSENGER_EVENTS.SEND_MESSAGE, msg);
            this.createMessage({text: msg, time: Date.now(), fromMe:true});
        });
    }

    createMessage(mes){
        const mesElem = document.createElement('div');
        mesElem.innerHTML = this.message({text:mes.text, time:mes.time});
        if(mes.fromMe){
            const myMes = mesElem.querySelector('.dialog-window__message');
            myMes.className = 'dialog-window__message dialog-window__message_me';
        }
        this.messagesPlace.appendChild(mesElem);
    }

    newMessageOtherDialog(msg){
        const dialog = this.root.getElementById(msg.id);
        const newMes = document.createElement('div');
        newMes.className='messenger__new-message';
        dialog.appendChild(newMes);
    }

    close() {
        super.close();
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
    }
}
