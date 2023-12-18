import {HeaderView} from './HeaderView.js';
import {EventBus} from '../../lib/eventbus.js';
import {COMMON_EVENTS, GLOBAL_EVENTS, MESSENGER_EVENTS} from '../../lib/constansts.js';
import {HeaderModel} from './HeaderModel.js';


/**
 * Класс контролера хедера и бокового меню
 */
export class HeaderController {
    constructor(root, sidePlace, globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.eventBus = new EventBus();
        this.view = new HeaderView(root, sidePlace, this.eventBus);
        this.model = new HeaderModel(this.eventBus);
        this.globalEventBus.on(GLOBAL_EVENTS.AUTH, (data) => this.eventBus.emit(COMMON_EVENTS.AUTH, data));
        this.globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => this.eventBus.emit(COMMON_EVENTS.UNAUTH));
        this.globalEventBus.on(GLOBAL_EVENTS.ADMIN_AUTH, () => this.view.renderAdmin());
        this.eventBus.on(MESSENGER_EVENTS.GET_MESSAGES, (data) => {
            this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT_WITH_HISTORY, data);
        });
        this.eventBus.on(MESSENGER_EVENTS.GET_PEMIUM, (link) => {
            this.globalEventBus.emit(COMMON_EVENTS.REDIRECT_WITH_HISTORY, link)
        });
        this.eventBus.on(MESSENGER_EVENTS.SHOW_LIKED, (element) => {
            this.globalEventBus.emit(COMMON_EVENTS.SHOW_LIKED, element)
        });
    }
}
