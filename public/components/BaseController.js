import {COMMON_EVENTS, GLOBAL_EVENTS} from '../lib/constansts.js';
import {EventBus} from '../lib/eventbus.js';

export class BaseController {
    constructor(globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.eventBus = new EventBus();
        this.eventBus.on(COMMON_EVENTS.NETWORK_ERROR, () => this.globalEventBus.emit(GLOBAL_EVENTS.NETWORK_ERROR));
    }

    render() {
        this.view.render();
    }

    close() {
        this.view.close();
    }
}
