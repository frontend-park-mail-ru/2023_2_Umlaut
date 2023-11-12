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
        this.eventBus.on(FEED_EVENTS.BLOCK_BUTTONS, this.blockButtons.bind(this));
    }

    render(data) {
        this.root.innerHTML = '';

        super.render(data);

        const userForm = this.root.querySelector('.form-feed');
        this.description = new Description(userForm);

        this.addSwipeBtns();

        this.eventBus.emit(FEED_EVENTS.GET_PERSON);
    }

    close() {
        super.close();

        this.dislikeBtn.removeEventListener('click', this.update.bind(this));
        this.likeBtn.removeEventListener('click', this.update.bind(this));
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    addSwipeBtns() {
        this.dislikeBtn = document.getElementById('dislike');
        this.likeBtn = document.getElementById('like');
        this.dislikeBtn.addEventListener('click', () => this.eventBus.emit(FEED_EVENTS.GET_PERSON));
        this.likeBtn.addEventListener('click', () => {
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
        this.close();
        this.render(user);
    }

    blockButtons() {
        this.dislikeBtn.removeEventListener('click', this.update.bind(this));
        this.likeBtn.removeEventListener('click', this.update.bind(this));
    }
}
