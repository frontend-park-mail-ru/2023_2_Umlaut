import { HEADER_EVENTS } from "../../lib/constansts.js";
import {Api} from '../../lib/api.js';

export class HeaderModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(HEADER_EVENTS.CHECK_AUTHORISED, this.isAuthorised.bind(this));
    }

    isAuthorised() {
        Api.user().then(
            (response) => {
                if ( response.status === 200 ) {
                    let user = response.payload;
                    user.message_photo = "/pics/messages.png";
                    user.user_photo = "/pics/avatar.png";
                    this.eventBus.emit(HEADER_EVENTS.AUTH, user);
                } else if ( response.status === 401 ) {
                    this.eventBus.emit(HEADER_EVENTS.UNAUTH);
                }
            },
        );
    }
}
