import {MESSENGER_EVENTS, DEFAULT_PHOTO} from '../../lib/constansts.js';
import {Api, handleStatuses} from '../../lib/api.js';

export class HeaderModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(MESSENGER_EVENTS.GET_PAIRS, this.getPairs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.GET_DIALOGS, this.getDialogs.bind(this));
    }

    getDialogs() {
        Api.getPairs().then( handleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const dialogs = [];
                    response.payload.forEach((element) => {
                        if (element.last_message !== null) {
                            element.user_dialog_id = `${element.id}_${element.user1_id}`;
                            this.my_id = element.user2_id;
                            dialogs.push(element);
                        }
                        if (element.сompanion_image_paths && element.сompanion_image_paths.length > 0) {
                            element.photo = element.сompanion_image_paths[0];
                        } else {
                            element.photo = DEFAULT_PHOTO;
                        }
                    });
                    this.eventBus.emit(MESSENGER_EVENTS.DIALOGS_READY, dialogs);
                }
            },
            this.eventBus),
        );
    }

    getPairs() {
        Api.getPairs().then( handleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const dialogs = [];
                    response.payload.forEach((element) => {
                        if (element.last_message === null) {
                            element.user_dialog_id = `${element.id}_${element.user1_id}`;
                            this.my_id = element.user2_id;
                            dialogs.push(element);
                        }
                        if (element.сompanion_image_paths && element.сompanion_image_paths.length > 0) {
                            element.photo = element.сompanion_image_paths[0];
                        } else {
                            element.photo = DEFAULT_PHOTO;
                        }
                    });
                    this.eventBus.emit(MESSENGER_EVENTS.PAIRS_READY, dialogs);
                }
            },
            this.eventBus),
        );
    }
}
