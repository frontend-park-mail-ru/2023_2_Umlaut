import {COMMON_EVENTS} from '../../lib/constansts.js';
import './Header.scss';

/**
 * Компонент хедер для всех страниц
 */
export class HeaderView {
    constructor(root, eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(COMMON_EVENTS.AUTH, this.render.bind(this));
        this.eventBus.on(COMMON_EVENTS.UNAUTH, this.renderU.bind(this));
        this.parent = root;
        this.template = require('./Header.hbs');
    }

    render(user) {
        this.parent.innerHTML = this.template(user);
    }

    renderU() {
        this.parent.innerHTML = this.template();
    }
}
