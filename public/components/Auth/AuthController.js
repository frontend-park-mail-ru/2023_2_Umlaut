import {AuthView} from './AuthView.js';
import {AuthModel} from './AuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


/**
 * Класс контроллера, отвечающий за вход в аккаунт
 */
export class AuthController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new AuthView(root, this.eventBus);
        this.model = new AuthModel(this.eventBus);
        this.eventBus.on(GLOBAL_EVENTS.REDIRECT, (path) => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, path));
        this.eventBus.on(GLOBAL_EVENTS.REDIRECT_WITH_HISTORY, (path) =>
            this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT_WITH_HISTORY, path));
        this.eventBus.on(COMMON_EVENTS.AUTH, (data) => this.globalEventBus.emit(GLOBAL_EVENTS.AUTH, data));
        this.eventBus.on(GLOBAL_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
        this.globalEventBus.on(GLOBAL_EVENTS.CHECK_AUTHORISED, () =>
            this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED, true));
    }

    /**
     * Рендер страницы входа
     */
    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED, false);
    }
}
