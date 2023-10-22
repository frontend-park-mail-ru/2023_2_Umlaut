import {FeedView} from './FeedView.js';
import {FeedModel} from './FeedModel.js';
import {BaseController} from '../BaseController.js';
import {FEED_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class FeedController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        const tmp = window.Handlebars.templates['Feed.hbs'];
        this.view = new FeedView(root, this.eventBus, tmp);
        this.model = new FeedModel(this.eventBus);
        this.eventBus.on(FEED_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/auth'));
    }
}
