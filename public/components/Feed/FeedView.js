import {Description} from '../Description/Description.js';
import {BaseView} from '../BaseView.js';
import {FEED_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент ленты с кнопками в анкете
 */
export class FeedView extends BaseView {
    description;
    parent;
    renderMenu;
    constructor(root, eventBus) {
        super(root, eventBus, require('./Feed.hbs'));
        this.eventBus.on(FEED_EVENTS.NEXT_PERSON_READY, this.update.bind(this));
    }

    /**
     * Рендерит страницу ленты, вставляет шаблоны описания пользователя и кнопок анкеты
     */
    render() {
        this.root.innerHTML = '';

        // const newDiv = document.createElement('div');
        // newDiv.className = 'main-part';
        super.render();

        const userForm = this.root.querySelector('.userForm');
        this.description = new Description(userForm);

        // this.root.appendChild(newDiv);

        this.addSwipeBtns();

        this.eventBus.emit(FEED_EVENTS.GET_NEXT_PEOPLE);
    }

    close() {
        super.close();
        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        // надо узнать можно ли чистить просто присваивая нулю
        dislikeBtn.removeEventListener('click', this.update.bind(this));
        likeBtn.removeEventListener('click', this.update.bind(this));
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    addSwipeBtns() {
        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        dislikeBtn.addEventListener('click', () => this.eventBus.emit(FEED_EVENTS.GET_PERSON));
        likeBtn.addEventListener('click', () => {
            this.eventBus.emit(FEED_EVENTS.RATE_PERSON, {'liked_to_user_id': this.user.id});
            this.eventBus.emit(FEED_EVENTS.GET_PERSON);
        });
    }

    /**
     * Меняет описание и фото одного пользователя в анкете на другого без перерендера других элементов анкеты
     * @param {Object} user - модель пользователя
     */
    update(user) {
        this.user = user;
        this.description.render(user);
    }
}
