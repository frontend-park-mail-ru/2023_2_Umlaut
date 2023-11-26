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
        this.socket = new WebSocketWrapper('wss://umlaut-bmstu.me/websocket');
        this.socket.connect();
        this.socket.subscribe('message', (msg)=>this.gotNewMessage(msg).bind(this));
        this.id = null;
    }

    getDialogs() {
        this.eventBus.emit(MESSENGER_EVENTS.DIALOGS_READY, null);
    }

    getPairs() {
        Api.getPairs().then( HandleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const dialogs = response.payload;
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
        this.socket.send(msg);
    }

    getMessages(id) {
        this.id = id;
        this.eventBus.emit(MESSENGER_EVENTS.MESSAGES_READY);
    }

    gotNewMessage(msg) {
        if (msg.id === this.id) {
            this.eventBus.emit(MESSENGER_EVENTS.NEW_MESSAGE_IN_THIS_DIALOG, msg);
        } else {
            this.eventBus.emit(MESSENGER_EVENTS.NEW_MESSAGE_IN_OTHER_DIALOG, msg);
        }
    }
}
