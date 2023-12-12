import {AdminAuthView} from './AdminAuthView.js';
import {AdminAuthModel} from './AdminAuthModel.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, COMMON_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';

/**
 * Класс контроллер для админского входа в приложение
 */
export class AdminAuthController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new AdminAuthView(root, this.eventBus);
        this.model = new AdminAuthModel(this.eventBus);
        this.eventBus.on(GLOBAL_EVENTS.REDIRECT, (p) => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, p));
        this.eventBus.on(COMMON_EVENTS.AUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.ADMIN_AUTH));
    }

    /**
     * метод для отрисовки админской страницы входа, 
     * проверяет авторизован ли пользователь, чтобы понимать показываеть ему эту страницу или нет
     */
    render() {
        this.eventBus.emit(AUTH_EVENTS.CHECK_AUTHORISED);
    }
}
