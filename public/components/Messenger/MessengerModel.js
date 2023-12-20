import {MESSENGER_EVENTS, COMMON_EVENTS, WEBSOCKET_URL, GLOBAL_EVENTS, DEFAULT_PHOTO} from '../../lib/constansts.js';
import {WebSocketWrapper} from '../../lib/ws.js';
import {Api, handleStatuses} from '../../lib/api.js';
import {nthIndex} from '../../lib/util.js';

/**
 * Класс, отвечающий за логику мессенджера
 */
export class MessengerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(MESSENGER_EVENTS.SEND_MESSAGE, this.sendMessage.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_MESSAGES, this.getMessages.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.MARK_AS_READ, this.markAsRead.bind(this));
        this.socket = new WebSocketWrapper(WEBSOCKET_URL);
        this.eventBus.on(COMMON_EVENTS.AUTH, this.socket.connect.bind(this.socket));
        this.eventBus.on(COMMON_EVENTS.UNAUTH, this.socket.disconnect.bind(this.socket));
        this.socket.subscribe('message', (msg)=>this.gotNewMessage(msg));
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
            this.eventBus.emit(MESSENGER_EVENTS.SEND, message);
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
     * Получает новые сообщения и уведомления о мэтчах
     * @param {Object} msg - новое сообщение
     */
    gotNewMessage(msg) {
        const mes = JSON.parse(msg);
        if (mes.type === 'message') {
            mes.payload.created_at = mes.payload.created_at.slice(mes.created_at.indexOf('T') + 1,
                nthIndex(mes.payload.created_at, ':', 2));
            if (mes.payload.dialog_id === this.payload.dialog_id) {
                this.eventBus.emit(MESSENGER_EVENTS.NEW_MESSAGE_IN_THIS_DIALOG, mes.payload);
            } else {
                Api.getDialogById(mes.payload.dialog_id).then(handleStatuses((r) =>{
                    this.eventBus.emit(MESSENGER_EVENTS.NEW_MESSAGE_IN_OTHER_DIALOG, mes.payload);
                    if (r.status === 200) {
                        if (r.payload?.сompanion_image_paths.length > 0) {
                            r.payload.photo = r.payload.сompanion_image_paths[0];
                        } else {
                            r.payload.photo = DEFAULT_PHOTO;
                        }
                        mes.payload.dialog = r.payload;
                        this.eventBus.emit(GLOBAL_EVENTS.NEW_MESSAGE, mes.payload);
                    }
                }, this.eventBus));
            }
        } else if (mes.type === 'match') {
            Api.user().then((response) => {
                if (response.status === 200) {
                    if (response.payload.image_paths && response.payload.image_paths.length > 0) {
                        mes.payload.my_photo = response.payload.image_paths[0];
                    } else {
                        mes.payload.my_photo = DEFAULT_PHOTO;
                    }
                }
            });
            this.eventBus.emit(MESSENGER_EVENTS.MATCH, mes.payload);
        }
    }
}
