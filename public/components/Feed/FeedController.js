import {FeedView} from './FeedView.js';
import {FeedModel} from './FeedModel.js';
import {BaseController} from '../BaseController.js';
import {FEED_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class FeedController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new FeedView(root, this.eventBus);
        this.model = new FeedModel(this.eventBus);
        this.eventBus.on(FEED_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
        // пока так лучше чтоб такие ивенты апи кидало
        // оно будет и всякие уведомления кидать
    }
}
