import { Api } from "../../lib/api.js";
import { FEED_EVENTS } from "../../lib/constansts.js";

export class FeedModel{
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(FEED_EVENTS.GET_NEXT, this.getNextPerson.bind(this));
    }

    /**
     * Получает с бекенда пользователя для показа в ленте
     * @return {object} user
     */
    async getNextPerson(render) {
        const response = await Api.feed();
        if ( response.status === 200) {
            render(response.body);
        } else if ( response.status === 401 ) {
            this.eventBus.emit(FEED_EVENTS.UNAUTH);
        }
    }

    async isAuthorised(){
        const resp = await Api.user();
        if ( resp.status === 401 ) {
            this.eventBus.emit(FEED_EVENTS.UNAUTH);
        }
    }
}