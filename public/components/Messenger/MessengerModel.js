import {MESSENGER_EVENTS} from '../../lib/constansts.js';

export class MessengerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(
            MESSENGER_EVENTS.GET_DIALOGS,
            this.getDialogs.bind(this),
        );
    }

    getDialogs() {
        this.eventBus.emit(MESSENGER_EVENTS.DIALOGS_READY, {
            dialogs: [
                {
                    id: 1,
                    name: 'Маша',
                    photo: '/pics/avatar.png',
                    lastMessage: 'Что делаешь вечером?',
                    unreadCount: 5,
                },
                {
                    id: 2,
                    name: 'Маша',
                    photo: '/pics/avatar.png',
                    lastMessage: 'Что делаешь вечером?',
                },
                {
                    id: 3,
                    name: 'Маша',
                    photo: '/pics/avatar.png',
                },
                {
                    id: 4,
                    name: 'Маша',
                    photo: '/pics/avatar.png',
                    lastMessage:
            'Что делаешь вечером? Cходим может куда-нибудь? раз-два-три',
                },
            ],
        });
    }
}
