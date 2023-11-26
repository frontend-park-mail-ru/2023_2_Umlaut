import {FeedView} from './FeedView.js';
import {FeedModel} from './FeedModel.js';
import {BaseController} from '../BaseController.js';
import {COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class FeedController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new FeedView(root, this.eventBus);
        this.model = new FeedModel(this.eventBus);
        this.eventBus.on(COMMON_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
    }
}
