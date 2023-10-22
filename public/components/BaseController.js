import {EventBus} from '../lib/eventbus.js';

export class BaseController {
    constructor(globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.eventBus = new EventBus();
    }

    render() {
        this.view.render();
    }

    close() {
        this.view.close();
    }
}
