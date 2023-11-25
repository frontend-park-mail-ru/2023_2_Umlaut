import {AdminAuthView} from './AdminAuthView.js';
import {AdminAuthModel} from './AdminAuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class StatisticsController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new AdminAuthView(root, this.eventBus);
        this.model = new AdminAuthModel(this.eventBus);
        this.eventBus.on(AUTH_EVENTS.AUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/admin'));
    }

    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED);
    }
}
