import {Api, HandleStatuses} from '../../lib/api.js';
import {FEED_EVENTS, SETTINGS_LIST} from '../../lib/constansts.js';

export class FeedModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.RATE_PERSON, this.ratePerson.bind(this));
        this.eventBus.on(FEED_EVENTS.GET_PERSON, this.getNextPerson.bind(this));
    }


    getNextPerson(data = {}) {
        Api.feed(data).then( HandleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const user = response.payload;
                    user.interests = SETTINGS_LIST.interests;
                    this.eventBus.emit(FEED_EVENTS.NEXT_PERSON_READY, user);
                } else if ( response.status === 404 ) {
                    this.eventBus.emit(FEED_EVENTS.NO_PEOPLE);
                }
            },
            this.eventBus),
        );
    }

    ratePerson(data) {
        Api.addLike(data.request).then( HandleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.getNextPerson(data.params);
                }
            },
            this.eventBus),
        );
    }
}
