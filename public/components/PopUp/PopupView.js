import { EventBus } from '../../lib/eventbus';
import { POPUP_EVENTS } from '../../lib/constansts.js';

/**
 * Компонент ленты с кнопками в анкете
 */
export class PopupView {
    constructor(root) {
        this.tmpl = require('./Popup.hbs');
        this.root = root;
        this.eventBus = new EventBus();
        this.popup = document.createElement('div');
        this.popup.className = 'dark-background';
        this.popup.innerHTML = this.tmpl();
        this.closePopup = () => this.eventBus.emit(POPUP_EVENTS.CLOSE);
        this.eventBus.on(POPUP_EVENTS.CLOSE, this.close.bind(this));
    }

    render() {
        this.root.appendChild(this.popup);

        this.popup.addEventListener('click', this.closePopup);
    }

    close() {
        this.popup.removeEventListener('click', this.closePopup);
        this.root.removeChild(this.popup);
    }
}
