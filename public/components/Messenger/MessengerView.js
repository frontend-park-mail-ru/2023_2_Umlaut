import {BaseView} from '../BaseView.js';
import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import {Carousel} from '../Carousel/Carousel.js';
import './Messenger.scss';
import {nthIndex} from '../../lib/util.js';

/**
 * Класс отображения мессенджера
 */
export class MessengerView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Messenger.hbs'));
        this.eventBus.on(MESSENGER_EVENTS.MESSAGES_READY, this.openDialog.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.NEW_MESSAGE_IN_THIS_DIALOG, this.createMessage.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.SEND, this.createMessage.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.NEW_MESSAGE_IN_OTHER_DIALOG, this.newMessageOtherDialog.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.MESSAGE_NOT_SENT, this.messageNotSent.bind(this));
        this.dialog = require('./MessengerWindow.hbs');
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
        this.message = require('./Message.hbs');
        this.eventBus.on();
        this.my_id = 0;
        this.cantSend = () =>
            this.eventBus.emit(MESSENGER_EVENTS.ERROR, 'Нет интернета, сообщение не может быть отправлено');
    }

    /**
     * отрисовывает окно диалога при его открытии
     */
    render() {
        super.render();
        this.dialogWindow = document.getElementById('dialog-window');
        if (window.location.pathname.split('/').slice(-1) !== 'messages') {
            this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES);
        }
        document.querySelector('.sidebar').className = 'sidebar';
    }

    /**
     * Отрисовывает сообщения в окне диалога
     * @param {Object} data - список сообщений
     */
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

        this.openDialogMessages(data);

        const inputText = this.dialogWindow.querySelector('#message');
        inputText.onchange = () => {
            const windowDialog = this.root.querySelector('.dialog-window__dialog');
            const unread = this.root.querySelector('.dialog-window__unread');
            if (unread) {
                windowDialog.removeChild(unread);
            }
        };

        const send = this.dialogWindow.querySelector('#send');
        const sendFunc = ()=>{
            const inputText = this.dialogWindow.querySelector('#message');
            const msg = inputText.value;
            inputText.value = '';
            if (msg.trim().length > 0) {
                this.eventBus.emit(MESSENGER_EVENTS.SEND_MESSAGE, msg);
            }
        };
        send.addEventListener('click', sendFunc);
        addEventListener('online', ()=>{
            const send = this.dialogWindow.querySelector('#send');
            if (send) {
                send.addEventListener('click', sendFunc);
                send.removeEventListener('click', this.cantSend);
            }
        });
        addEventListener('offline', ()=>{
            const send = this.dialogWindow.querySelector('#send');
            if (send) {
                send.removeEventListener('click', sendFunc);
                send.addEventListener('click', this.cantSend);
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

        this.renderUserForm(data.user);

        const cross = this.root.querySelector('#cross');
        const user = this.root.querySelector('#user-name');
        cross.addEventListener('click', ()=>
            this.root.querySelector('.messenger__user-form').classList.toggle('messenger__user-form_invisible'));
        user.addEventListener('click', ()=>
            this.root.querySelector('.messenger__user-form').classList.toggle('messenger__user-form_invisible'));
    }

    messageNotSent(data) {
        this.dialogWindow.querySelector('#message').value = data;
    }

    openDialogMessages(data) {
        data.dialogs.forEach((mes) => {
            mes.created_at = mes.created_at.slice(mes.created_at.indexOf('T') + 1,
                nthIndex(mes.created_at, ':', 2));
            this.createMessage(mes);
        });
    }

    renderUserForm(user) {
        const userForm = this.root.querySelector('.messenger__user-form');
        userForm.innerHTML += require('../Feed/Description.hbs')(user);
        const carouselRoot = this.root.querySelector('.form-feed__feed-photo');
        userForm.querySelector('.form-feed__description').className = 'form-feed__description_no-overflow';
        this.carousel = new Carousel(carouselRoot);
        this.carousel.render(user.image_paths);
    }

    /**
     * Создает элемент сообщения
     * @param {Object} mes - объект сообщения, которое нужно отрисовать
     */
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
        windowDialog.appendChild(mesElem);
        const block = this.root.querySelector('.dialog-window__dialog');
        block.scrollTop = block.scrollHeight;
    }

    /**
     * Закрытие страницы сообщений
     */
    close() {
        super.close();
        this.dialogWindow = null;
        this.dialogListView = null;
        this.dialogList = null;
    }

    /**
     * Создает элемент нового сообщения
     * @param {Object} msg - сообщение
     */
    newMessageOtherDialog(msg) {
        const dialog = document.getElementById(msg.dialog_id);
        if (!dialog) {
            return;
        }
        const newMes = document.createElement('div');
        newMes.className = 'dialog-preview__new-message';
        dialog.appendChild(newMes);
    }
}
