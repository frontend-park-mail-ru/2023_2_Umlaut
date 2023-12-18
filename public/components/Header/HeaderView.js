import {COMMON_EVENTS, MESSENGER_EVENTS} from '../../lib/constansts.js';
import {fromHTML} from '../../lib/util.js';
import './Header.scss';

/**
 * Отображения хедера и бокового меню для всех страниц
 */
export class HeaderView {
    constructor(root, sidePlace, eventBus) {
        this.eventBus = eventBus;
        this.sidePlace = sidePlace;
        this.eventBus.on(COMMON_EVENTS.AUTH, this.render.bind(this));
        this.eventBus.on(COMMON_EVENTS.UNAUTH, this.renderU.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.PAIRS_READY, this.gotPairs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.LIKED_READY, this.gotLiked.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.DIALOGS_READY, this.gotDialogs.bind(this));
        this.parent = root;
        this.template = require('./Header.hbs');
        this.adminTemplate = require('./HeaderAdmin.hbs');
        this.side = require('./Sidebar.hbs');
        this.dialogPreviewTemplate = require('./DialogPreview.hbs');

        this.showMenu = ()=>{
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('sidebar__visible');
        };
    }

    /**
     * Рендерит версию хедера и бокового меню для авторизованных пользователей
     * @param {Object} user - модель пользователя
     */
    render(user) {
        const menuBtn = document.querySelector('.main__menu-btn');
        menuBtn.removeEventListener('click', this.showMenu);

        if (user.role === 2) {
            user.premium = true;
        } else {
            user.premium = false;
        }
        this.parent.innerHTML = this.template(user);
        this.sidePlace.innerHTML = this.side(user);
        this.eventBus.emit(MESSENGER_EVENTS.GET_PAIRS_AND_DIALOGS);
        this.eventBus.emit(MESSENGER_EVENTS.GET_LIKED);
        menuBtn.style.display = 'block';

        menuBtn.addEventListener('click', this.showMenu);
    }

    /**
     * Рендерит версию хедера и бокового меню для неавторизованных пользователей
     */
    renderU() {
        this.parent.innerHTML = this.template();
        this.sidePlace.innerHTML = this.side();
        document.querySelector('.main__menu-btn').style.display = 'none';
        const menuBtn = document.querySelector('.main__menu-btn');
        menuBtn.removeEventListener('click', this.showMenu);
    }

    /**
     * Рендерит версию хедера и бокового меню для администратора
     */
    renderAdmin() {
        this.parent.innerHTML = this.adminTemplate();
    }

    /**
     * Рендерит пары пользователя в боковое меню
     * @param {Object} data - пары
     */
    gotPairs(data) {
        const pairs = this.sidePlace.querySelector('#pairs');
        data.forEach((element) => {
            const pair = document.createElement('img');
            pair.className = 'sidebar__photo-avatar';
            pair.src = element.photo;
            pairs.appendChild(pair);
            pair.addEventListener('click', ()=>{
                this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES, `/messages/${element.id}`);
            });
        });
    }

    /**
     * Рендерит тех кто лайкнул пользователя в боковое меню
     * @param {Object} data - лайкнувшие
     */
    gotLiked(data) {
        const pairs = this.sidePlace.querySelector('#liked');
        if (!data.show) {
            data.likes.forEach((element) => {
                const pair = document.createElement('img');
                pair.className = 'sidebar__photo-avatar';
                pair.src = element.photo;
                pairs.appendChild(pair);
                pair.addEventListener('click', ()=>{
                    this.eventBus.emit(MESSENGER_EVENTS.GET_PEMIUM, '/premium');
                });
            });
        } else {
            data.likes.forEach((element) => {
                const pair = document.createElement('img');
                pair.className = 'sidebar__photo-avatar';
                pair.src = element.photo;
                pairs.appendChild(pair);
                pair.addEventListener('click', ()=>{
                    this.eventBus.emit(MESSENGER_EVENTS.SHOW_LIKED, element);
                });
            });
        }
    }

    /**
     * Рендерит диалоги для бокового меню
     * @param {Object} data - диалоги
     */
    gotDialogs(data) {
        const dialogs = this.sidePlace.querySelector('.sidebar__dialogs');
        dialogs.innerHTML = '';
        data.forEach((dialog) => {
            const dialogPreview = fromHTML(this.dialogPreviewTemplate(dialog));

            dialogPreview.addEventListener('click', ()=>{
                this.eventBus.emit(MESSENGER_EVENTS.GET_MESSAGES, `/messages/${dialog.id}`);
            });
            dialogs.appendChild(dialogPreview);
            if (dialog.last_message !== null && !dialog.last_message.is_read) {
                const newMes = document.createElement('div');
                newMes.className = 'dialog-preview__new-message';
                dialogPreview.querySelector('.dialog-preview').appendChild(newMes);
            }
        });
    }
}
