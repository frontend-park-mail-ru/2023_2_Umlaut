import {CsatView} from './CsatView.js';
import {Api} from '../../lib/api.js';
import {BaseController} from '../BaseController.js';
import {GLOBAL_EVENTS} from '../../lib/constansts.js';


/**
 * Класс отвечающий за показ ксата (опрос удовлетворенности сайтом)
 * @param {array} images - ссылки на фотографии пользователя
 * @param {int} index - номер фотографии, которая должна быть сейчас показана
 */
export class CsatController extends BaseController {
    constructor(root, globalEventBus) {
        super(globalEventBus);
        this.showChecked = false;
        this.view = new CsatView(root, this.eventBus);
        globalEventBus.on(GLOBAL_EVENTS.AUTH, (data) => {
            this.onAuth(data);
        });
    }

    /**
     * Проверяет возможность показа ксата и рендерит ксат
     */
    onAuth() {
        if (this.showChecked) {
            return;
        }

        Api.csat().then((responce) => {
            if (responce.status === 200) {
                if (responce.payload !== 0) {
                    setTimeout( () => this.view.render(responce.payload), 2000);
                }
                this.showChecked = true;
            } else if ( responce.status === 401) {
                this.globalEventBus.emit(GLOBAL_EVENTS.UNAUTH);
            }
        });
    }
}
