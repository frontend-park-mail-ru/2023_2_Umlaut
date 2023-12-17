import {BaseView} from '../BaseView.js';
import './Premium.scss';

export class PremiumView extends BaseView {
    constructor(root, eventBus) {
        super(root, eventBus, require('./Premium.hbs'));
        this.parent = root;
        this.eventBus = eventBus;
    }

    render() {
        super.render();
    }
}
