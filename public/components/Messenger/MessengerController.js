import {MessengerModel} from './MessengerModel.js';
import {MessengerView} from './MessengerView.js';
import {BaseController} from '../BaseController.js';
import {COMMON_EVENTS, GLOBAL_EVENTS, MESSENGER_EVENTS} from '../../lib/constansts.js';


/**
 * Класс контроллера мессенджера
 */
export class MessengerController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new MessengerView(root, this.eventBus);
        this.model = new MessengerModel(this.eventBus);
        this.globalEventBus.on(GLOBAL_EVENTS.AUTH, (data) => this.eventBus.emit(COMMON_EVENTS.AUTH, data));
        this.globalEventBus.on(GLOBAL_EVENTS.UNAUTH, () => this.eventBus.emit(COMMON_EVENTS.UNAUTH));
        this.eventBus.on(MESSENGER_EVENTS.MATCH, (mes)=>this.globalEventBus.emit(GLOBAL_EVENTS.POPUP_MATCH, mes));
        this.eventBus.on(GLOBAL_EVENTS.NEW_MESSAGE, (mes) =>
            this.globalEventBus.emit(GLOBAL_EVENTS.NEW_MESSAGE, mes));
        this.eventBus.on(MESSENGER_EVENTS.ERROR, (data)=>this.globalEventBus.emit(GLOBAL_EVENTS.POPUP, data));
    }
}
