import {AuthView} from './AuthView.js';
import {AuthModel} from './AuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class AuthController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        const tmp = window.Handlebars.templates['Auth.hbs'];
        this.view = new AuthView(root, this.eventBus, tmp);
        this.model = new AuthModel(this.eventBus);
        this.eventBus.on(AUTH_EVENTS.AUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/feed'));
    }
}
