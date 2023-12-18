import { Api } from "../../lib/api.js";
import { PREMIUM_EVENTS } from "../../lib/constansts.js";

export class PremiumModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(PREMIUM_EVENTS.GET_LINK, this.getInviteLink.bind(this));
    }

    getInviteLink(){
        Api.getLink().then((response) =>{
            if(response.status === 200){
                this.eventBus.emit(PREMIUM_EVENTS.GOT_LINK, response.payload);
            }
        });
    }
}
