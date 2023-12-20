import {FeedView} from './FeedView.js';
import {FeedModel} from './FeedModel.js';
import {BaseController} from '../BaseController.js';
import {COMMON_EVENTS, GLOBAL_EVENTS, FEED_EVENTS} from '../../lib/constansts.js';

/**
 * Класс контроллера ленты
 */
export class FeedController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new FeedView(root, this.eventBus);
        this.model = new FeedModel(this.eventBus);
        this.eventBus.on(COMMON_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
        this.globalEventBus.on(COMMON_EVENTS.ONLINE, ()=> this.eventBus.emit(COMMON_EVENTS.ONLINE));
        this.eventBus.on(GLOBAL_EVENTS.POPUP_COMPLAINT, (data) =>
            this.globalEventBus.emit(GLOBAL_EVENTS.POPUP_COMPLAINT, data));
        this.globalEventBus.on(GLOBAL_EVENTS.SHOW_LIKED, (element) => {
            this.eventBus.emit(FEED_EVENTS.SHOW_LIKED, element);
        });
        this.eventBus.on(GLOBAL_EVENTS.REDIRECT_WITH_HISTORY, (data) => {
            this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT_WITH_HISTORY, data);
        });
    }
}
