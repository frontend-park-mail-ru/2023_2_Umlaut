import {SignupView} from './SignupView.js';
import {AuthModel} from '../Auth/AuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class SignupController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new SignupView(root, this.eventBus);
        this.model = new AuthModel(this.eventBus);
        this.eventBus.on(AUTH_EVENTS.AUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/feed'));
        this.eventBus.on(AUTH_EVENTS.AUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.AUTH));
    }

    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED);
    }
}
