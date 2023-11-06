import {Api} from '../../lib/api.js';
import {FEED_EVENTS} from '../../lib/constansts.js';

export class FeedModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.RATE_PERSON, this.ratePerson.bind(this));
        this.eventBus.on(FEED_EVENTS.GET_PERSON, this.getNextPerson.bind(this));
    }


    getNextPerson() {
        Api.feed().then((response) => {
            if ( response.status === 200) {
                const user = response.payload;
                Api.getUserPhotoUrl(user.id).then(
                    (image) =>{
                        user.photo = image;
                        this.eventBus.emit(FEED_EVENTS.NEXT_PERSON_READY, user);
                    },
                );
            } else if ( response.status === 401 ) {
                this.eventBus.emit(FEED_EVENTS.UNAUTH);
            }
        });
    }

    ratePerson(id) {
        Api.addLike(id).then((response) => {
            if ( response.status === 401 ) {
                this.eventBus.emit(FEED_EVENTS.UNAUTH);
            } else if ( response.status === 200 ) {
                console.log('success like');
            }
        });
    }
}
