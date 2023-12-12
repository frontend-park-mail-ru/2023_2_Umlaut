import {EventBus} from '../../lib/eventbus';
import {POPUP_EVENTS, COMPLAIN_TYPES} from '../../lib/constansts.js';
import './Popup.scss';

/**
 * Компонент ленты с кнопками в анкете
 */
export class PopupView {
    constructor(root) {
        this.popupTmpl = require('./Popup.hbs');
        this.popupConfirmTmpl = require('./Confirm.hbs');
        this.popupChooseTmpl = require('./Choose.hbs');
        this.popupComplaintTmpl = require('./Complaint.hbs');
        this.root = root;
        this.eventBus = new EventBus();
        this.popup = this.root.querySelector('.popup');
        this.popup.innerHTML = this.popupTmpl();
        this.closePopup = () => this.eventBus.emit(POPUP_EVENTS.CLOSE);
        this.eventBus.on(POPUP_EVENTS.CLOSE, this.close.bind(this));
        this.closeEvent = this.closeIfNotInPopup.bind(this);
        this.firstClick = true;
        this.rendered = false;
    }

    render(msg) {
        const notification = this.popup.querySelector('.popup__notify');
        this.popup.querySelector('.popup__text').textContent = msg;
        notification.style.visibility = 'visible';
        notification.style.opacity = 0.6;
        setTimeout(() => {
            this.close();
        }, 3000);
    }

    renderConfirm(data) {
        if (this.rendered) {
            return;
        }
        this.rendered = true;
        this.firstClick = true;

        const confirm = document.createElement('div');
        confirm.className = 'popup__confirm';
        confirm.innerHTML = this.popupConfirmTmpl({text: data.text});
        this.popup.appendChild(confirm);
        this.currentPopup = confirm;

        this.popup.querySelector('#yes').addEventListener('click', () => {
            data.func();
            this.closeCurrent();
        });

        this.popup.querySelector('#no').addEventListener('click', this.closeCurrent.bind(this));

        document.body.addEventListener('click', this.closeEvent);
    }

    renderChoose(data) {
        if (this.rendered) {
            return;
        }
        this.choosenVariant = undefined;
        this.rendered = true;
        this.firstClick = true;
        const choose = document.createElement('div');
        this.currentPopup = choose;
        choose.className = 'popup__choose';
        choose.innerHTML = this.popupChooseTmpl(data);
        this.popup.appendChild(choose);
        const variants = this.popup.querySelector('.popup__variants');
        const confirmBtn = this.popup.querySelector('.popup__submit');
        confirmBtn.addEventListener('click', () => {
            if (this.choosenVariant) {
                if (this.choosenVariant.tagName === 'input') {
                    data.func(this.choosenVariant.value);
                } else {
                    data.func(this.choosenVariant.innerHTML);
                }

                this.closeCurrent();
            }
        });

        document.body.addEventListener('click', this.closeEvent);

        variants.addEventListener('click', (e) => {
            if (e.target.classList.contains('popup__variant')) {
                if (this.choosenVariant) {
                    this.choosenVariant.classList.toggle('popup__variant-selected');
                } else {
                    confirmBtn.classList.toggle('btn_important');
                }

                e.target.classList.toggle('popup__variant-selected');
                this.choosenVariant = e.target;
            }
        });
    }

    renderComplaint(callback) {
        if (this.rendered) {
            return;
        }
        this.choosenVariant = undefined;
        this.rendered = true;
        this.firstClick = true;
        const complaint = document.createElement('div');
        this.currentPopup = complaint;
        complaint.className = 'popup__choose';
        complaint.innerHTML = this.popupComplaintTmpl({complaint_types: COMPLAIN_TYPES});
        this.popup.appendChild(complaint);
        const variants = this.popup.querySelector('.popup__variants');
        const confirmBtn = this.popup.querySelector('.popup__submit');
        const textInput = this.popup.querySelector('.popup__text-input');

        confirmBtn.addEventListener('click', () => {
            if (this.choosenVariant && confirmBtn.classList.contains('btn_important')) {
                callback({
                    type: parseInt(this.choosenVariant.id),
                    description: textInput.value.trim(),
                });
                this.closeCurrent();
            }
        });

        textInput.addEventListener('input', () => {
            if (!this.choosenVariant || !this.choosenVariant.classList.contains('need_text')) {
                return;
            }
            if (textInput.value.trim() === '') {
                if (confirmBtn.classList.contains('btn_important')) {
                    confirmBtn.classList.remove('btn_important');
                }
            } else {
                if (!confirmBtn.classList.contains('btn_important')) {
                    confirmBtn.classList.add('btn_important');
                }
            }
        });

        document.body.addEventListener('click', this.closeEvent);

        variants.addEventListener('click', (e) => {
            if (e.target.classList.contains('popup__variant')) {
                if (this.choosenVariant) {
                    this.choosenVariant.classList.toggle('popup__variant-selected');
                }
                e.target.classList.toggle('popup__variant-selected');

                if (e.target.classList.contains('need_text') && textInput.value.trim() === '') {
                    if (confirmBtn.classList.contains('btn_important')) {
                        confirmBtn.classList.remove('btn_important');
                    }
                } else if (!confirmBtn.classList.contains('btn_important')) {
                    confirmBtn.classList.add('btn_important');
                }

                this.choosenVariant = e.target;
            }
        });
    }


    closeCurrent() {
        if (this.popup.contains(this.currentPopup)) {
            this.popup.removeChild(this.currentPopup);
            document.body.removeEventListener('click', this.closeEvent);
            this.rendered = false;
        }
    }

    closeIfNotInPopup(e) {
        if (this.firstClick) {
            this.firstClick = false;
            return;
        }
        if (this.popup.contains(e.target)) {
            return;
        }
        this.closeCurrent();
    }

    close() {
        document.removeEventListener('click', this.closePopup);
        const notification = this.popup.querySelector('.popup__notify');
        notification.style.opacity = 0;
        notification.style.visibility = 'hidden';
    }
}
