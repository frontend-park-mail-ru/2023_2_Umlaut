import {MESSENGER_EVENTS} from '../../lib/constansts.js';
import {Api, HandleStatuses} from '../../lib/api.js';

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
}
