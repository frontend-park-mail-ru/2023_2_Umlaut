import {Api} from '../../lib/api.js';
import {FEED_EVENTS} from '../../lib/constansts.js';

export class FeedModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.RATE_PERSON, this.getNextPerson.bind(this));
    }

    /**
     * Получает с бекенда пользователя для показа в ленте
     * @return {object} user
     */
    async getNextPerson() {
        Api.feed().then((response) => {
            if ( response.status === 200) {
                this.eventBus.emit(FEED_EVENTS.NEXT_PERSON_READY, response.payload);
            } else if ( response.status === 401 ) {
                this.eventBus.emit(FEED_EVENTS.UNAUTH);
            }
        });
    }
}
