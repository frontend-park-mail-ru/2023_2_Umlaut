import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import { Api } from '../../lib/api.js';

export class MessengerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(MESSENGER_EVENTS.GET_DIALOGS, this.getDialogs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_PAIRS, this.getPairs.bind(this));
    }

    getDialogs() {
        this.eventBus.emit(MESSENGER_EVENTS.DIALOGS_READY, 
            [
                {
                    id: 1,
                    user2_id: 'Маша',
                    photo: '/pics/avatar.png',
                    lastMessage: 'Что делаешь вечером?',
                    unreadCount: 5,
                },
                {
                    id: 2,
                    user2_id: 'Маша',
                    photo: '/pics/avatar.png',
                    lastMessage: 'Что делаешь вечером?',
                },
                {
                    id: 3,
                    user2_id: 'Маша',
                    photo: '/pics/avatar.png',
                },
                {
                    id: 4,
                    user2_id: 'Маша',
                    photo: '/pics/avatar.png',
                    lastMessage:'Что делаешь вечером? Cходим может куда-нибудь? раз-два-три',
                },
            ],
        );
    }

    getPairs() {
        Api.getPairs().then(
            (response) => {
                if ( response.status === 200 && response.payload) {
                    let dialogs = response.payload;
                    dialogs.forEach((element) => {
                        Api.getUserPhotoUrl(element.user2_id).then(
                            image =>{
                                element.photo = image;
                                this.eventBus.emit(MESSENGER_EVENTS.PAIRS_READY, dialogs);
                            }
                        );
                    });
                } else if ( response.status === 401 ) {
                    this.eventBus.emit(MESSENGER_EVENTS.UNAUTH);
                }
            },
        );
    }
}
