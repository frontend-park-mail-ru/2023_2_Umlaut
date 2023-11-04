import {SettingsView} from './SettingsView.js';
import {SettingsModel} from './SettingsModel.js';
import {BaseController} from '../BaseController.js';
import {SETTINGS_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class SettingsController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        const tmp = window.Handlebars.templates['Settings.hbs'];
        this.view = new SettingsView(root, this.eventBus, tmp);
        this.model = new SettingsModel(this.eventBus);
        this.eventBus.on(SETTINGS_EVENTS.SUCCESS, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/feed'));
        this.eventBus.on(SETTINGS_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH));
    }

    render() {
        this.eventBus.emit(SETTINGS_EVENTS.CHECK_AUTHORISED);
    }
}