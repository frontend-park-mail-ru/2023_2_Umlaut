import {STAT_EVENTS, COMMON_EVENTS} from '../../lib/constansts.js';
import {Api} from '../../lib/api.js';

export class StatisticsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(STAT_EVENTS.GET_STAT, this.getStat.bind(this));
    }

    getStat() {
        Api.feedback().then(
            (feedbackResp) => {
                if (feedbackResp.status === 200) {
                    Api.recomendation().then((recomendationResp) =>{
                        if (recomendationResp.status === 200) {
                            this.eventBus.emit(STAT_EVENTS.STAT_READY, {...feedbackResp.payload,
                                ...recomendationResp.payload});
                        } else if (recomendationResp.status === 401) {
                            this.eventBus.emit(COMMON_EVENTS.UNAUTH);
                        }
                    });
                } else if (feedbackResp.status === 401) {
                    this.eventBus.emit(COMMON_EVENTS.UNAUTH);
                }
            },
        );
    }
}
