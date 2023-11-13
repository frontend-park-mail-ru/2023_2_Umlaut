import {HeaderView} from './HeaderView.js';
import {HeaderModel} from './HeaderModel.js';
import {EventBus} from '../../lib/eventbus.js';
import {HEADER_EVENTS} from '../../lib/constansts.js';


export class HeaderController {
    constructor(root) {
        this.eventBus = new EventBus();
        this.view = new HeaderView(root, this.eventBus);
        this.model = new HeaderModel(this.eventBus);
    }

    renderUnauth() {
        this.view.renderU();
    }

    render() {
        this.eventBus.emit(HEADER_EVENTS.CHECK_AUTHORISED);
    }
}
