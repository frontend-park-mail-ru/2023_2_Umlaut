import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import {DEFAULT_PHOTO} from '../../lib/constansts.js';
import {WebSocketWrapper} from '../../lib/ws.js';
import {Api, HandleStatuses} from '../../lib/api.js';

export class MessengerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(MESSENGER_EVENTS.GET_DIALOGS, this.getDialogs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_PAIRS, this.getPairs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.SEND_MESSAGE, this.sendMessage.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_MESSAGES, this.getMessages.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.MARK_AS_READ, this.markAsRead.bind(this));
        this.socket = new WebSocketWrapper('wss://umlaut-bmstu.me/websocket');
        this.socket.connect();
        this.socket.subscribe('message', (msg)=>this.gotNewMessage(msg).bind(this));
        this.id = null;
        this.dialog_id = null;
        this.my_id = null;
    }

    getDialogs() {
        Api.getPairs().then( HandleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const dialogs = [];
                    response.payload.forEach((element) => {
                        if (element.last_message !== null) {
                            element.user_dialog_id = `${element.id}_${element.user1_id}`;
                            this.my_id = element.user2_id;
                            dialogs.push(element);
                        }
                    });
                    this.eventBus.emit(MESSENGER_EVENTS.PAIRS_READY, dialogs);
                }
            },
            this.eventBus),
        );
    }

    getPairs() {
        Api.getPairs().then( HandleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const dialogs = [];
                    response.payload.forEach((element) => {
                        if (element.last_message === null) {
                            element.user_dialog_id = `${element.id}_${element.user1_id}`;
                            this.my_id = element.user2_id;
                            dialogs.push(element);
                        }
                    });
                    this.eventBus.emit(MESSENGER_EVENTS.PAIRS_READY, dialogs);
                }
            },
            this.eventBus),
        );
    }

    addPhotos(dialogs) {
        if (dialogs) {
            dialogs.forEach((element) => {
                Api.getUserPhotoUrl(element.user2_id).then(
                    (image) =>{
                        element.photo = image;
                        if (image === undefined) {
                            element.photo = DEFAULT_PHOTO;
                        }
                    },
                );
            });
        }
        return Promise.resolve(dialogs);
    }

    sendMessage(msg) {
        const message = {
            'sender_id': this.my_id,
            'recipient_id': this.id,
            'dialog_id': this.dialog_id,
            'message_text': msg,
            'is_read': false,
        };
        this.socket.send(message);
    }

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

    getMessages(userData) {
        this.dialog_id = Number(userData.id.slice(0, userData.id.indexOf('_')));
        this.id = Number(userData.id.slice(userData.id.indexOf('_') + 1));
        Api.getMessages(this.dialog_id).then((response)=>{
            if (response.status === 200) {
                const data = {};
                data.dialogs = response.payload;
                if (data.dialogs === null) {
                    data.dialogs = [];
                } else {
                    this.dialog_id = data.dialogs[0].dialog_id;
                }
                data.my_id = this.my_id;
                data.name = userData.name;
                this.eventBus.emit(MESSENGER_EVENTS.MESSAGES_READY, data);
            }
        });
    }


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

    nthIndex(str, pat, n) {
        const L = str.length; let i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }
}
