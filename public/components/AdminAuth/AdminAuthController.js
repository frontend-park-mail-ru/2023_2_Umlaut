import {AdminAuthView} from './AdminAuthView.js';
import {AdminAuthModel} from './AdminAuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class AdminAuthController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new AdminAuthView(root, this.eventBus);
        this.model = new AdminAuthModel(this.eventBus);
        this.eventBus.on(GLOBAL_EVENTS.REDIRECT, (path) => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, path));
    }

    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED);
    }
}
