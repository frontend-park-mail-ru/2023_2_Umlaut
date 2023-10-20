import {Api} from '../../lib/api.js';
import {Description} from '../Description/Description.js';

/**
 * Компонент ленты с кнопками в анкете
 */
export class Feed {
    description;
    parent;
    renderMenu;
    router;
    constructor(renderMenu = () => {}, router) {
        this.parent = document.getElementById('root');
        this.renderMenu = renderMenu;
        this.router = router;
    }

    /**
     * Получает с бекенда пользователя для показа в ленте
     * @return {object} user
     */
    async getNextPerson() {
        const response = await Api.feed();
        if ( response.status === 200) {
            return response.body;
        } else if ( response.status === 401 ) {
            this.router.go('/auth');
        }
    }

    /**
     * Рендерит страницу ленты, вставляет шаблоны описания пользователя и кнопок анкеты
     */
    async render() {
        const resp = await Api.user();
        if ( resp.status === 401 ) {
            this.router.go('/auth');
            return;
        }
        this.parent.innerHTML = '';
        this.renderMenu();

        const newDiv = document.createElement('div');
        newDiv.className = 'main-part';
        newDiv.innerHTML = window.Handlebars.templates['Feed.hbs']();

        const userForm = newDiv.querySelector('.userForm');
        this.description = new Description(userForm);

        this.parent.appendChild(newDiv);

        this.addSwipeBtns();

        this.update();
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    addSwipeBtns() {
        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        const messagesBtn = document.getElementById('messages');
        dislikeBtn.addEventListener('click', () => this.update());
        likeBtn.addEventListener('click', () => this.update());
        messagesBtn.addEventListener('click', () => this.router.go('/messages'));
    }

    /**
     * Меняет описание и фото одного пользователя в анкете на другого без перерендера других элементов анкеты
     */
    async update() {
        this.description.render(await this.getNextPerson());
    }
}
