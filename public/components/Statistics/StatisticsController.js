import {StatisticsModel} from './StatisticsModel.js';
import {StatisticsView} from './StatisticsView.js';
import {BaseController} from '../BaseController.js';
import {AUTH_EVENTS, GLOBAL_EVENTS} from '../../lib/constansts.js';


export class StatisticsController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.view = new StatisticsView(root, this.eventBus);
        this.model = new StatisticsModel(this.eventBus);
        this.eventBus.on(AUTH_EVENTS.UNAUTH, () => this.globalEventBus.emit(GLOBAL_EVENTS.REDIRECT, '/admin/auth'));
    }
}
