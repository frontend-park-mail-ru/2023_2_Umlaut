import './Csat.scss';
import {STAT_EVENTS} from '../../lib/constansts';

/**
 * Компонент страницы авторизации (входа)
 */
export class StatisticsView {
    csatDiv;
    iframe;
    constructor(root, eventBus) {
        this.root = root;
        this.eventBus = eventBus;
        this.template = require('./Statistics.hbs');
        this.eventBus.on(STAT_EVENTS.STAT_READY, this.render.bind(this));
    }

    render(data) {
        if (data === undefined) {
            this.eventBus.emit(STAT_EVENTS.GET_STAT);
            return;
        }
        this.root.innerHTML = this.template(data);
    }
}
