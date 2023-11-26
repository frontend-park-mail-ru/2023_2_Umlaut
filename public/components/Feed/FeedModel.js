import {Api, HandleStatuses} from '../../lib/api.js';
import {FEED_EVENTS} from '../../lib/constansts.js';

export class FeedModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.RATE_PERSON, this.ratePerson.bind(this));
        this.eventBus.on(FEED_EVENTS.GET_PERSON, this.getNextPerson.bind(this));
    }


    getNextPerson() {
        Api.feed().then( HandleStatuses(
            (response) => {
                if ( response.status === 200) {
                    const user = response.payload;
                    this.eventBus.emit(FEED_EVENTS.NEXT_PERSON_READY, user);
                } else if ( response.status === 404 ) {
                    this.eventBus.emit(FEED_EVENTS.NO_PEOPLE);
                }
            },
            this.eventBus),
        );
    }

    ratePerson(id) {
        Api.addLike(id).then( HandleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.getNextPerson();
                }
            },
            this.eventBus),
        );
    }
}
