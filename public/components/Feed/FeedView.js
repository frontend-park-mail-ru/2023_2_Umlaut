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
        this.eventBus.on(FEED_EVENTS.NO_PEOPLE, this.showStub.bind(this));
    }

    render(data) {
        this.root.innerHTML = '';

        super.render(data);

        if( data === undefined )
            this.eventBus.emit(FEED_EVENTS.GET_PERSON);
        else
            this.activateBtns();
    }

    close() {
        super.close();
        this.blockButtons();
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    activateBtns() {
        this.dislikeBtn = document.getElementById('dislike');
        this.likeBtn = document.getElementById('like');
        this.dislikeBtn.addEventListener('click', () => this.eventBus.emit(FEED_EVENTS.GET_PERSON));
        this.likeBtn.addEventListener('click', () => {
            this.eventBus.emit(FEED_EVENTS.RATE_PERSON, {'liked_to_user_id': this.user.id});
            this.blockButtons();
            this.eventBus.emit(FEED_EVENTS.GET_PERSON);
        });
    }

    blockButtons() {
        if (this.dislikeBtn) {
            this.dislikeBtn.removeEventListener('click', this.update.bind(this));
            this.likeBtn.removeEventListener('click', this.update.bind(this));
        }
    }

    showStub(){
        console.log("пользователи кончились");
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
}
