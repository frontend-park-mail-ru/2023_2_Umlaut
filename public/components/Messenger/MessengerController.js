import {MessengerModel} from './MessengerModel.js';
import {MessengerView} from './MessengerView.js';
import {BaseController} from '../BaseController.js';


export class MessengerController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new MessengerView(root, this.eventBus);
        this.model = new MessengerModel(this.eventBus);
    }

    render() {
        this.view.render();
    }
}
