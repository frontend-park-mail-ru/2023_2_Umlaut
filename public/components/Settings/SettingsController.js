import {SettingsView} from './SettingsView.js';
import {SettingsModel} from './SettingsModel.js';
import {BaseController} from '../BaseController.js';
import {SETTINGS_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class SettingsController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new SettingsView(root, this.eventBus);
        this.model = new SettingsModel(this.eventBus);
        const log = () => {this.eventBus.emit(SETTINGS_EVENTS.LOGOUT);this.eventBus.emit(SETTINGS_EVENTS.HIDE);}
        this.eventBus.on(SETTINGS_EVENTS.SUCCESS, () => this.globalEventBus.emit(GLOBAL_EVENTS.POPUP));
        this.eventBus.on(SETTINGS_EVENTS.SHOW_CONFIRM_LOG, () => this.globalEventBus.emit(GLOBAL_EVENTS.POPUP_CONFIRM, log));
        this.eventBus.on(SETTINGS_EVENTS.PHOTO_UPLOADED, () => this.globalEventBus.emit(GLOBAL_EVENTS.RERENDER_HEADER));
        this.eventBus.on(SETTINGS_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
    }

    render() {
        this.eventBus.emit(SETTINGS_EVENTS.CHECK_AUTHORISED);
    }
}
