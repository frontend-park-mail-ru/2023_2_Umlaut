import {CsatView} from './FeedView.js';
import {Api} from '../../lib/api.js';
import {BaseController} from '../BaseController.js';
import {GLOBAL_EVENTS} from '../../lib/constansts.js';


export class CsatController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.showChecked = false;
        this.view = new CsatView(root, this.eventBus);
        globalEventBus.on(GLOBAL_EVENTS.AUTH, () => this.onAuth.bind(this));
    }

    onAuth() {
        if (this.showChecked) {
            return;
        }

        Api.csat().then((responce) => {
            if (responce.status === 200) {
                if (responce.payload === 0) {
                    this.view.render(responce.payload);
                }
            } else if ( responce.status === 401) {
                this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH);
            }
        });
    }
}
