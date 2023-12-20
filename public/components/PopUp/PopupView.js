import {EventBus} from '../../lib/eventbus';
import {POPUP_EVENTS, COMPLAIN_TYPES} from '../../lib/constansts.js';
import './Popup.scss';
import {fromHTML} from '../../lib/util.js';

/**
 * Компонент попапа
 */
export class PopupView {
    constructor(root) {
        this.popupTmpl = require('./Popup.hbs');
        this.popupConfirmTmpl = require('./Confirm.hbs');
        this.popupChooseTmpl = require('./Choose.hbs');
        this.popupComplaintTmpl = require('./Complaint.hbs');
        this.popupMatchTmpl = require('./PopupMatch.hbs');
        this.root = root;
        this.eventBus = new EventBus();
        this.popup = this.root.querySelector('.popup');
        this.popup.innerHTML = this.popupTmpl();
        this.closePopup = () => this.eventBus.emit(POPUP_EVENTS.CLOSE);
        this.newMesTemplate = require('./NewMessage.hbs');
        this.eventBus.on(POPUP_EVENTS.CLOSE, this.close.bind(this));
        this.closeEvent = this.closeIfNotInPopup.bind(this);
        this.firstClick = true;
        this.rendered = false;
        this.notificationAudio = new Audio('/notification.mp3');
        this.notificationAudio.volume = 0.5;
    }

    /**
     * Отрисовывает попап-уведомление
     * @param {String} msg - строка которую нужно отобразить в уведомлении
     */
    render(msg) {
        const notification = this.popup.querySelector('.popup__notify');
        this.popup.querySelector('.popup__text').textContent = msg;
        notification.style.visibility = 'visible';
        notification.style.opacity = 0.6;
        setTimeout(() => {
            this.close();
        }, 3000);
    }

    /**
     * Отрисовывает попап-уведомление о том что нужно заполнить настройки
     */
    renderPopupAboutSettings() {
        const notification = this.popup.querySelector('.popup__notify');
        this.popup.querySelector('.popup__text').textContent =
        `Ваш аккаунт сейчас не виден пользователям с полной анкетой, 
        заполните свои настройки чтобы снять это ограничение`;
        notification.style.visibility = 'visible';
        notification.style.opacity = 0.6;
        notification.className = '.popup__settings';
        setTimeout(() => {
            this.close();
        }, 10000);
    }


    /**
     * Отрисовывает попап-подтверждение
     * @param {Object} data - text: информация которую нужно отобразить и func:действие в случае "да"
     */
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

    /**
     * Отрисовывает попап-выбор-из-нескольких-вариантов
     * @param {Object} data - информация которую нужно отобразить
     */
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

    /**
     * Отрисовывает попап жалобы
     * @param {Object} callback - что нужно сделать после выбора варианта
     */
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
            if ( !this.choosenVariant?.classList.contains('need_text')) {
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

    /**
     * Показывает уведомление о сообщении со звуком
     * @param {*} mes - пришедшее сообщение
     */
    renderNewMessage(mes) {
        const notification = fromHTML(this.newMesTemplate(mes));
        notification.style.visibility = 'visible';
        notification.style.opacity = 0.9;
        this.popup.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => {
                this.popup.removeChild(notification);
            }, 500);
        }, 4000);
        this.notificationAudio.pause();
        this.notificationAudio.currentTime = 0;
        this.notificationAudio.play();
    }

    /**
     * Отрисовывает попап-match
     * @param {Object} data - информация которую нужно отобразить
     */
    renderMatch(data) {
        if (this.rendered) {
            return;
        }
        this.rendered = true;
        this.firstClick = true;

        const match = document.createElement('div');
        match.className = 'popup__match';
        match.innerHTML = this.popupMatchTmpl(data);
        this.popup.appendChild(match);
        this.currentPopup = match;

        match.querySelector('#toDialog').addEventListener('click', this.closeCurrent.bind(this));
        match.querySelector('#toFeed').addEventListener('click', this.closeCurrent.bind(this));
    }


    /**
     * Закрывает попап
     */
    closeCurrent() {
        if (this.popup.contains(this.currentPopup)) {
            this.popup.removeChild(this.currentPopup);
            document.body.removeEventListener('click', this.closeEvent);
            this.rendered = false;
        }
    }

    /**
     * Закрывает попап по клику вне него
     * @param {Event} e - событие клика
     */
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

    /**
     * Закрытие попапа
     */
    close() {
        document.removeEventListener('click', this.closePopup);
        const notification = this.popup.querySelector('.popup__notify');
        notification.style.opacity = 0;
        notification.style.visibility = 'hidden';
    }
}
