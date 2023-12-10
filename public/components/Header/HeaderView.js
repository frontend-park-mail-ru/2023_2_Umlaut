import {COMMON_EVENTS, MESSENGER_EVENTS} from '../../lib/constansts.js';
import './Header.scss';

/**
 * Компонент хедер для всех страниц
 */
export class HeaderView {
    constructor(root, sidePlace, eventBus) {
        this.eventBus = eventBus;
        this.sidePlace = sidePlace;
        this.eventBus.on(COMMON_EVENTS.AUTH, this.render.bind(this));
        this.eventBus.on(COMMON_EVENTS.UNAUTH, this.renderU.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.PAIRS_READY, this.gotPairs.bind(this));
        this.eventBus.on(MESSENGER_EVENTS.DIALOGS_READY, this.gotDialogs.bind(this));
        this.parent = root;
        this.template = require('./Header.hbs');
        this.adminTemplate = require('./HeaderAdmin.hbs');
        this.side = require('./Sidebar.hbs');
        this.dialogPreviewTemplate = require('./DialogPreview.hbs');
    }

    render(user) {
        this.parent.innerHTML = this.template(user);
        this.sidePlace.innerHTML = this.side(user);
        this.eventBus.emit(MESSENGER_EVENTS.GET_PAIRS);
        this.eventBus.emit(MESSENGER_EVENTS.GET_DIALOGS);
        const menuBtn = document.querySelector('.main__menu-btn');
        menuBtn.addEventListener('click', ()=>{
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('sidebar__visible');
        });
    }

    renderU() {
        this.parent.innerHTML = this.template();
    }

    renderAdmin() {
        this.parent.innerHTML = this.adminTemplate();
    }

    gotPairs(data) {
        const pairs = this.sidePlace.querySelector('.sidebar__pairs');
        data.forEach((element) => {
            const pair = document.createElement('img');
            pair.className = 'sidebar__photo-avatar';
            pair.src = element.photo;
            pairs.appendChild(pair);
        });
    }

    gotDialogs(data) {
        const dialogs = this.sidePlace.querySelector('.sidebar__dialogs');
        dialogs.innerHTML = '';
        data.forEach((dialog) => {
            const dialogPreview = document.createElement('div');
            dialogPreview.className = 'sidebar__dialog';
            dialogPreview.innerHTML = this.dialogPreviewTemplate(dialog);

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
