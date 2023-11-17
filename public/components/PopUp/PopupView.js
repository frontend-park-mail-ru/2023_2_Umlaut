import {EventBus} from '../../lib/eventbus';
import {POPUP_EVENTS} from '../../lib/constansts.js';
import './Popup.scss';

/**
 * Компонент ленты с кнопками в анкете
 */
export class PopupView {
    constructor(root) {
        this.popupTmpl = require('./Popup.hbs');
        this.popupConfirmTmpl = require('./Confirm.hbs');
        this.root = root;
        this.eventBus = new EventBus();
        this.popup = document.createElement('div');
        this.popup.className = 'popup popup_dark';
        this.closePopup = () => this.eventBus.emit(POPUP_EVENTS.CLOSE);
        this.eventBus.on(POPUP_EVENTS.CLOSE, this.close.bind(this));
    }

    render() {
        this.popup.innerHTML = this.popupTmpl();
        this.root.appendChild(this.popup);

        this.popup.addEventListener('click', this.closePopup);
    }

    renderConfirm(data) {
        this.popup.innerHTML = this.popupConfirmTmpl({text:data.text});
        this.root.appendChild(this.popup);
        const no = this.root.querySelector('#no');
        const yes = this.root.querySelector('#yes');
        no.addEventListener('click', this.closePopup);
        yes.addEventListener('click', data.func);
        this.popup.addEventListener('click', this.closePopup);
    }

    close() {
        this.popup.removeEventListener('click', this.closePopup);
        this.root.removeChild(this.popup);
    }
}
