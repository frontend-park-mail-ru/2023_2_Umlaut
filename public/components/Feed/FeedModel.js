import {Api} from '../../lib/api.js';
import {FEED_EVENTS} from '../../lib/constansts.js';

export class FeedModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.RATE_PERSON, this.ratePerson.bind(this));
        this.eventBus.on(FEED_EVENTS.GET_PERSON, this.getNextPerson.bind(this));
        this.eventBus.on(FEED_EVENTS.GET_NEXT_PEOPLE, this.getNextPeople.bind(this));
        this.queue = [];
        this.started = false;
    }

    getNextPerson() {
        if (this.queue.length === 0) {
            this.eventBus.emit(FEED_EVENTS.GET_NEXT_PEOPLE, false);
        } else {
            const user = this.queue.shift();
            Api.getUserPhotoUrl(user.id).then(
                (image) =>{
                    user.photo = image;
                    this.eventBus.emit(FEED_EVENTS.NEXT_PERSON_READY, user);
                },
            );
        }
        if (this.queue.length === 2) {
            this.eventBus.emit(FEED_EVENTS.GET_NEXT_PEOPLE);
        }
    }

    getNextPeople(isStarted = true) {
        this.started = isStarted;
        Api.feed().then((response) => {
            if ( response.status === 200) {
                this.users = response.payload;
                this.users.forEach((user) => {
                    this.queue.push(user);
                });
                if (!this.started) {
                    this.eventBus.emit(FEED_EVENTS.GET_PERSON);
                    this.started = true;
                }
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
                if (response.message === '') {
                    this.eventBus.emit(FEED_EVENTS.MUTUAL);
                }
            }
        });
    }
}
