import {SignupView} from './SignupView.js';
import {AuthModel} from '../Auth/AuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';

/**
 * Класс контроллера, отвечающий за регистрацию нового аккаунта
 */
export class SignupController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new SignupView(root, this.eventBus);
        this.model = new AuthModel(this.eventBus);
        this.eventBus.on(GLOBAL_EVENTS.REDIRECT, (path) => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, path));
        this.eventBus.on(COMMON_EVENTS.AUTH, (data) => this.globalEventBus.emit(GLOBAL_EVENTS.AUTH, data));
        this.eventBus.on(GLOBAL_EVENTS.POPUP_SETTINGS, ()=> this.globalEventBus.emit(GLOBAL_EVENTS.POPUP_SETTINGS));
    }

    /**
     * Рендер страницы регистрации
     */
    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED, false);
    }
}
