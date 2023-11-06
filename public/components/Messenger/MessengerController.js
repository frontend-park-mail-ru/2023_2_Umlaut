import {MessengerModel} from './MessengerModel.js';
import {MessengerView} from './MessengerView.js';
import {BaseController} from '../BaseController.js';
import {MESSENGER_EVENTS} from '../../lib/constansts.js';


export class MessengerController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new MessengerView(root, this.eventBus);
        this.model = new MessengerModel(this.eventBus);
        this.eventBus.on(MESSENGER_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
    }

    render() {
        this.view.render();
    }
}
