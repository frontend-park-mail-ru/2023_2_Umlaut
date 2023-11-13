import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import {Api} from '../../lib/api.js';
import { DEFAULT_PHOTO } from '../../lib/constansts.js';

export class MessengerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(MESSENGER_EVENTS.GET_DIALOGS, this.getDialogs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_PAIRS, this.getPairs.bind(this));
    }

    getDialogs() {
        this.eventBus.emit(MESSENGER_EVENTS.DIALOGS_READY, null);
    }

    getPairs() {
        Api.getPairs().then(
            (response) => {
                if ( response.status === 200) {
                    const dialogs = response.payload;
                    this.addPhotos(dialogs).then((dialogs)=> this.eventBus.emit(MESSENGER_EVENTS.PAIRS_READY, dialogs));
                } else if ( response.status === 401 ) {
                    this.eventBus.emit(MESSENGER_EVENTS.UNAUTH);
                }
            },
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
}
