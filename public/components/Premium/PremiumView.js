import {BaseView} from '../BaseView.js';
import { PREMIUM_EVENTS } from "../../lib/constansts.js";
import './Premium.scss';

export class PremiumView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Premium.hbs'));
        this.parent = root;
        this.eventBus = eventBus;
        this.eventBus.on(PREMIUM_EVENTS.GOT_LINK, this.render.bind(this));
    }

    render(link) {
        if(!link)
            this.eventBus.emit(PREMIUM_EVENTS.GET_LINK);
        else
            super.render(link);
    }
}
