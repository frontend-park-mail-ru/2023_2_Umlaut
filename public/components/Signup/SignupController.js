import {SignupView} from './SignupView.js';
import {AuthModel} from '../Auth/AuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class SignupController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        const tmp = window.Handlebars.templates['Signup.hbs'];
        this.view = new SignupView(root, this.eventBus, tmp);
        this.model = new AuthModel(this.eventBus);
        this.eventBus.on(AUTH_EVENTS.AUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/feed'));
    }

    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED);
    }
}
