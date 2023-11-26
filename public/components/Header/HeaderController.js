import {HeaderView} from './HeaderView.js';
import {EventBus} from '../../lib/eventbus.js';
import {COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class HeaderController {
    constructor(root, globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.eventBus = new EventBus();
        this.view = new HeaderView(root, this.eventBus);
        this.globalEventBus.on(GLOBAL_EVENTS.AUTH, (data) => this.eventBus.emit(COMMON_EVENTS.AUTH, data));
        this.globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => this.eventBus.emit(COMMON_EVENTS.UNAUTH));
    }
}
