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
        this.popup = this.root.querySelector('.popup');
        this.popup.innerHTML = this.popupTmpl();
        this.closePopup = () => this.eventBus.emit(POPUP_EVENTS.CLOSE);
        this.eventBus.on(POPUP_EVENTS.CLOSE, this.close.bind(this));
    }

    render(msg) {
        const notification = this.popup.querySelector('.popup__notify');
        this.popup.querySelector('.popup__text').textContent = msg;
        notification.style.visibility = 'visible';
        notification.style.opacity = 0.8;
        setTimeout(() => {
            this.close();
        }, 3000);
        document.addEventListener('click', this.closePopup);
    }

    renderConfirm(data) {
        const confirm = document.createElement('div');
        confirm.className = 'popup__confirm';
        confirm.innerHTML = this.popupConfirmTmpl({text: data.text});
        this.popup.appendChild(confirm);
        const yes = this.popup.querySelector('#yes');
        this.popup.addEventListener('click', ()=>{
            this.popup.removeChild(confirm);
        });
        yes.addEventListener('click', data.func);
    }

    close() {
        document.removeEventListener('click', this.closePopup);
        const notification = this.popup.querySelector('.popup__notify');
        notification.style.opacity = 0;
        notification.style.visibility = 'hidden';
    }
}
