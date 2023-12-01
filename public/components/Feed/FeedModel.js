import {Api, handleStatuses, loadTags} from '../../lib/api.js';
import {FEED_EVENTS, SETTINGS_LIST} from '../../lib/constansts.js';

export class FeedModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.RATE_PERSON, this.ratePerson.bind(this));
        this.eventBus.on(FEED_EVENTS.GET_PERSON, this.getNextPerson.bind(this));
        this.eventBus.on(FEED_EVENTS.COMPLAIN_PERSON, this.complainPerson.bind(this));
    }


    getNextPerson(data = {}) {
        Api.feed(data).then( handleStatuses(
            async (response) => {
                if ( response.status === 200) {
                    const user = response.payload;
                    if (!SETTINGS_LIST.interests) {
                        await loadTags(this.eventBus);
                    }
                    user.interests = SETTINGS_LIST.interests;
                    this.eventBus.emit(FEED_EVENTS.NEXT_PERSON_READY, user);
                } else if ( response.status === 404 ) {
                    if (!SETTINGS_LIST.interests) {
                        await loadTags(this.eventBus);
                    }
                    this.eventBus.emit(FEED_EVENTS.NO_PEOPLE, {noPeople: true, interests: SETTINGS_LIST.interests});
                }
            },
            this.eventBus),
        );
        Api.getTags();
    }

    ratePerson(data) {
        Api.addLike(data.request).then( handleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.getNextPerson(data.params);
                }
            },
            this.eventBus),
        );
    }

    complainPerson(data) {
        Api.complaint(data.request).then( handleStatuses(
            (response) => {
                if ( response.status === 200 ) {
                    this.getNextPerson(data.params);
                }
            },
            this.eventBus),
        );
    }
}
