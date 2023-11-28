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
        this.popupChooseTmpl = require('./Choose.hbs');
        this.root = root;
        this.eventBus = new EventBus();
        this.popup = this.root.querySelector('.popup');
        this.popup.innerHTML = this.popupTmpl();
        this.closePopup = () => this.eventBus.emit(POPUP_EVENTS.CLOSE);
        this.eventBus.on(POPUP_EVENTS.CLOSE, this.close.bind(this));
        this.closeEvent = this.closeIfNotInPopup.bind(this);
        this.firstClick = true;
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

    renderChoose(data) {
        this.firstClick = true;
        const choose = document.createElement('div');
        this.currentPopup = choose;
        choose.className = 'popup__choose';
        choose.innerHTML = this.popupChooseTmpl(data);
        this.popup.appendChild(choose);
        const variants = this.popup.querySelector('.popup__variants');

        document.body.addEventListener('click', this.closeEvent);

        variants.addEventListener('click', (e) => {
            if (e.target.classList.contains('popup__variant')) {
                data.func(e.target.innerHTML);
                this.popup.removeChild(choose);
                document.body.removeEventListener('click', this.closeEvent);
            }
        });
    }

    closeIfNotInPopup(e) {
        if (this.firstClick) {
            this.firstClick = false;
            return;
        }
        if (this.popup.contains(e.target)) {
            return;
        }
        this.popup.removeChild(this.currentPopup);
        document.body.removeEventListener('click', this.closeEvent);
    }

    close() {
        document.removeEventListener('click', this.closePopup);
        const notification = this.popup.querySelector('.popup__notify');
        notification.style.opacity = 0;
        notification.style.visibility = 'hidden';
    }
}
