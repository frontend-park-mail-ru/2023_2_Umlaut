import {SettingsView} from './SettingsView.js';
import {SettingsModel} from './SettingsModel.js';
import {BaseController} from '../BaseController.js';
import {SETTINGS_EVENTS, GLOBAL_EVENTS, COMMON_EVENTS} from '../../lib/constansts.js';

/**
 * Класс контроллера настроек
 */
export class SettingsController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new SettingsView(root, this.eventBus);
        this.model = new SettingsModel(this.eventBus);
        this.eventBus.on(SETTINGS_EVENTS.SUCCESS, (text) => this.globalEventBus.emit(GLOBAL_EVENTS.POPUP, text));
        this.eventBus.on(SETTINGS_EVENTS.SHOW_CONFIRM_LOG, (data) =>
            this.globalEventBus.emit(GLOBAL_EVENTS.POPUP_CONFIRM, data));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_UPLOADED, () => this.globalEventBus.emit(GLOBAL_EVENTS.RERENDER_HEADER));
        this.eventBus.on(COMMON_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
    }

    /**
     * Проверяет авторизован ли пользователь
     */
    render() {
        this.eventBus.emit(SETTINGS_EVENTS.CHECK_AUTHORISED);
    }
}
