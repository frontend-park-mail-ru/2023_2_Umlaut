import {BaseController} from '../BaseController.js';
import {PremiumModel} from './PremiumModel.js';
import {PremiumView} from './PremiumView.js';

export class PremiumController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new PremiumView(root, this.eventBus);
        this.model = new PremiumModel(this.eventBus);
    }
}
