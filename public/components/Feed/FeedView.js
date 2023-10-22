import {Description} from '../Description/Description.js';
import { BaseView } from '../BaseView.js';
import { FEED_EVENTS } from '../../lib/constansts.js';

/**
 * Компонент ленты с кнопками в анкете
 */
export class FeedView extends BaseView {
    description;
    parent;
    renderMenu;
    constructor(root, eventBus, tmpl) {
        super(root, eventBus, tmpl);
        this.parent=root;
        this.eventBus = eventBus;
    }

    /**
     * Рендерит страницу ленты, вставляет шаблоны описания пользователя и кнопок анкеты
     */
    render() {
        this.parent.innerHTML = '';
        // this.renderMenu();

        const newDiv = document.createElement('div');
        newDiv.className = 'main-part';
        super.render(newDiv)

        const userForm = newDiv.querySelector('.userForm');
        this.description = new Description(userForm);

        this.parent.appendChild(newDiv);

        this.addSwipeBtns();

        this.update();
    }

    close() {
        super.close();
        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        dislikeBtn.removeEventListener('click', () => this.update());
        likeBtn.removeEventListener('click', () => this.update());
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    addSwipeBtns() {
        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        //const messagesBtn = document.getElementById('messages');
        dislikeBtn.addEventListener('click', () => this.update());
        likeBtn.addEventListener('click', () => this.update());
        //messagesBtn.addEventListener('click', () => this.router.go('/messages'));
    }

    /**
     * Меняет описание и фото одного пользователя в анкете на другого без перерендера других элементов анкеты
     */
    async update() {
        this.eventBus.emit(FEED_EVENTS.GET_NEXT, this.description.render.bind(this.description));
    }
}
