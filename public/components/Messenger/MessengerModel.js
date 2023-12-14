import {MESSENGER_EVENTS, COMMON_EVENTS} from '../../lib/constansts.js';
import {WebSocketWrapper} from '../../lib/ws.js';
import {Api} from '../../lib/api.js';

/**
 * Класс, отвечающий за логику мессенджера
 */
export class MessengerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(MESSENGER_EVENTS.SEND_MESSAGE, this.sendMessage.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_MESSAGES, this.getMessages.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.MARK_AS_READ, this.markAsRead.bind(this));
        this.socket = new WebSocketWrapper('wss://umlaut-bmstu.me/websocket');
        this.eventBus.on(COMMON_EVENTS.AUTH, this.socket.connect.bind(this.socket));
        this.eventBus.on(COMMON_EVENTS.UNAUTH, this.socket.disconnect.bind(this.socket));
        this.socket.subscribe('message', (msg)=>this.gotNewMessage(msg).bind(this));
        this.id = null;
        this.dialog_id = null;
        this.my_id = null;
    }

    /**
     * Отправляет сообщения
     * @param {String} msg - текст сообщения
     */
    sendMessage(msg) {
        const date = new Date();
        const message = {
            'sender_id': this.my_id,
            'recipient_id': this.id,
            'dialog_id': this.dialog_id,
            'message_text': msg,
            'is_read': false,
            'created_at': date,
        };
        try {
            this.socket.send(message);
            message.created_at = `${date.getHours()}:${date.getMinutes()}`;
            this.eventBus.emit(MESSENGER_EVENTS.SENT, message);
        } catch (e) {
            this.eventBus.emit(MESSENGER_EVENTS.ERROR, 'Ошибка сервера, сообщение не может быть отправлено');
        }
    }

    /**
     * Отмечает сообщения в диалоге как прочитанные
     * @param {Object} data - сообщения, которые надо отметить прочитанными
     */
    markAsRead(data) {
        data.forEach((msg) => {
            if (!msg.is_read) {
                this.socket.send({
                    'id': msg.id,
                    'sender_id': msg.sender_id,
                    'recipient_id': 201,
                    'dialog_id': msg.dialog_id,
                    'message_text': msg.message_text,
                    'is_read': true,
                });
            }
        });
    }

    /**
     * Получает все сообщения открытого сейчас диалога
     */
    getMessages() {
        const path = window.location.pathname;
        const data = {};
        this.dialog_id = Number(path.split('/')[path.split('/').length - 1]);
        Api.getDialogById(this.dialog_id).then((dialog)=>{
            if (dialog.status === 200) {
                this.my_id = dialog.payload.user2_id;
                this.id = dialog.payload.user1_id;
                Api.getMessages(this.id).then((response)=>{
                    if (response.status === 200) {
                        data.dialogs = response.payload;
                        if (data.dialogs === null) {
                            data.dialogs = [];
                        } else {
                            this.dialog_id = data.dialogs[0].dialog_id;
                        }
                        Api.getUserById(this.id).then((user2)=>{
                            if (user2.status === 200) {
                                data.user = user2.payload;
                                data.my_id = this.my_id;
                                this.eventBus.emit(MESSENGER_EVENTS.MESSAGES_READY, data);
                            }
                        });
                    }
                });
            }
        });
    }


    /**
     * Получает новые сообщения
     * @param {Object} msg - новое сообщение
     */
    gotNewMessage(msg) {
        const mes = JSON.parse(msg);
        mes.created_at = mes.created_at.slice(mes.created_at.indexOf('T') + 1,
            this.nthIndex(mes.created_at, ':', 2));
        if (mes.dialog_id === this.dialog_id) {
            this.eventBus.emit(MESSENGER_EVENTS.NEW_MESSAGE_IN_THIS_DIALOG, mes);
        } else {
            this.eventBus.emit(MESSENGER_EVENTS.NEW_MESSAGE_IN_OTHER_DIALOG, mes);
        }
    }

    /**
     * Обрезает строку по подстроке и возвращает индекс конкретного по счету
     * @param {String} str - строка которую нужно обрезать
     * @param {String} pat - подстрока по которой нужно обрезать
     * @param {Int} n - номер символа индекс которого нужно вернуть
     * @return {Int} - индекс нужного символа
     */
    nthIndex(str, pat, n) {
        const L = str.length; let i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }
}
