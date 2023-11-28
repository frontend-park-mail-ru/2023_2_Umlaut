import {BaseController} from '../BaseController.js';
import {COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';
import {ComplainsView} from './ComplainsView.js';
import {ComplainsModel} from './ComplainsModel.js';


export class ComplainsController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new ComplainsView(root, this.eventBus);
        this.model = new ComplainsModel(this.eventBus);
        this.eventBus.on(COMMON_EVENTS.UNAUTH, () =>
            this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/admin/auth'));
    }
}
