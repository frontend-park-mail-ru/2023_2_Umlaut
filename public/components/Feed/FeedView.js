import {BaseView} from '../BaseView.js';
import {Carousel} from '../Carousel/Carousel.js';
import {FEED_EVENTS} from '../../lib/constansts.js';
import './Feed.scss';

/**
 * Компонент ленты с кнопками в анкете
 */
export class FeedView extends BaseView {
    description;
    parent;
    renderMenu;
    carousel;
    constructor(root, eventBus) {
        super(root, eventBus, require('./Feed.hbs'));
        this.eventBus.on(FEED_EVENTS.NEXT_PERSON_READY, this.update.bind(this));
        this.eventBus.on(FEED_EVENTS.NO_PEOPLE, this.showStub.bind(this));
        this.update = this.update.bind(this);
        this.params = {};
    }

    render(data) {
        this.root.innerHTML = '';

        super.render(data);

        const searchBtn = this.root.querySelector('#search-btn');
        const searchForm = this.root.querySelector('.search');
        searchBtn.addEventListener('click', () => searchForm.classList.toggle('search_visible'));
        document.addEventListener('mouseup', this.clickWithinDiv);

        if ( data === undefined ) {
            this.eventBus.emit(FEED_EVENTS.GET_PERSON);
        } else {
            this.addSearchParams();

            const carouselRoot = this.root.querySelector('.form-feed__feed-photo');
            this.carousel = new Carousel(carouselRoot);
            this.carousel.render(data.image_paths);
            this.activateBtns();
        }
    }

    clickWithinDiv(e) {
        const container = document.querySelector('.search');
        if (!container.contains(e.target)) {
            container.className = 'search';
        }
    }

    close() {
        super.close();
        this.blockButtons();
        document.removeEventListener('mouseup', this.clickWithinDiv);
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    activateBtns() {
        this.dislikeBtn = document.getElementById('dislike');
        this.likeBtn = document.getElementById('like');
        this.dislikeFunc = () => {
            this.eventBus.emit(FEED_EVENTS.RATE_PERSON, {
                request: {'liked_to_user_id': this.user.id, 'is_like': false},
                params: this.params,
            });
            this.blockButtons();
        };
        this.likeFunc = () => {
            this.eventBus.emit(FEED_EVENTS.RATE_PERSON, {
                request: {'liked_to_user_id': this.user.id, 'is_like': true},
                params: this.params,
            });
            this.blockButtons();
        };
        this.dislikeBtn.addEventListener('click', this.dislikeFunc);
        this.likeBtn.addEventListener('click', this.likeFunc);
    }

    blockButtons() {
        if (this.dislikeBtn) {
            this.dislikeBtn.removeEventListener('click', this.dislikeFunc);
            this.likeBtn.removeEventListener('click', this.likeFunc);
        }
    }

    showStub(data) {
        console.log('пользователи кончились');
        super.render(data);
        const searchBtn = this.root.querySelector('#search-btn');
        const searchForm = this.root.querySelector('.search');
        searchBtn.addEventListener('click', () => searchForm.classList.toggle('search_visible'));
        this.addSearchParams();
    }

    addSearchParams() {
        this.selectTags();
        const readySearch = this.root.querySelector('#readySearch');
        readySearch.addEventListener('click', ()=>{
            const tags = this.root.querySelectorAll('.multiselection__selection_active');
            this.params.tags = [];
            tags.forEach((tag) => {
                this.params.tags.push(tag.innerHTML);
            });
            this.params.min_age = this.root.querySelector('#from-age').value;
            this.params.max_age = this.root.querySelector('#to-age').value;
            const container = this.root.querySelector('.search');
            container.className = 'search';
            this.eventBus.emit(FEED_EVENTS.GET_PERSON, this.params);
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

    selectTags() {
        const selected = this.root.querySelector('.multiselection__selected');
        const list = this.root.querySelectorAll('.multiselection__selection_variant');
        for (let i = 0; i < list.length; i++) {
            list[i].addEventListener('click', () => {
                list[i].classList.toggle('multiselection__selection_active');
                if (list[i].classList.contains('multiselection__selection_active')) {
                    const modifyTag = document.createElement('span');
                    modifyTag.className = 'multiselection__selection multiselection__selection_selected';
                    modifyTag.innerHTML = list[i].innerHTML;
                    selected.appendChild(modifyTag);
                } else {
                    const allTags = document.querySelectorAll('.multiselection__selection_selected');
                    allTags.forEach((element) => {
                        if (element.innerHTML === list[i].innerHTML) {
                            selected.removeChild(element);
                        }
                    });
                }
            });
        }
    }
}
