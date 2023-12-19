import {BaseView} from '../BaseView.js';
import {Carousel} from '../Carousel/Carousel.js';
import {COMMON_EVENTS, FEED_EVENTS, GLOBAL_EVENTS, SETTINGS_LIST} from '../../lib/constansts.js';
import './Feed.scss';

/**
 * Класс отображения ленты
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
        this.eventBus.on(COMMON_EVENTS.ONLINE, ()=> {
            this.blockButtons(), this.activateBtns();
        });
        this.eventBus.on(FEED_EVENTS.SHOW_LIKED, this.showLikedPerson.bind(this));
        this.update = this.update.bind(this);
        this.params = {tags: []};
        this.user;
    }

    /**
     * Метод отображения ленты
     * @param {object} data - анкета следующего пользователя, которую надо отрендерить
     */
    render(data) {
        this.root.innerHTML = '';
        if (data) {
            data.params = this.params;
            this.user = data.user;
            data.like_counter = 50 - data.like_counter;
        }
        super.render(data);

        const searchBtn = this.root.querySelector('#search-btn');
        const searchForm = this.root.querySelector('.search');
        searchBtn.addEventListener('click', () => searchForm.classList.toggle('search_visible'));
        document.addEventListener('mouseup', this.clickWithinDiv);

        if ( data === undefined ) {
            this.eventBus.emit(FEED_EVENTS.GET_PERSON);
        } else {
            this.addSearchParams();

            const complainBtn = this.root.querySelector('.form-feed__complain');
            complainBtn.addEventListener('click', () => this.eventBus.emit(GLOBAL_EVENTS.POPUP_COMPLAINT,
                (complain) => this.complainCurrent(complain)),
            );

            const carouselRoot = this.root.querySelector('.form-feed__feed-photo');
            this.carousel = new Carousel(carouselRoot);
            this.carousel.render(data.user.image_paths);
            this.activateBtns();
        }
        document.querySelector('.sidebar').className = 'sidebar';
    }

    /**
     * Метод жалобы на пользователя
     * @param {object} complain - жалоба
     */
    complainCurrent(complain) {
        this.eventBus.emit(FEED_EVENTS.COMPLAIN_PERSON, {
            request: {
                'reported_user_id': this.user.id,
                'complaint_type_id': complain.type,
                'complaint_text': complain.description,
            },
            params: this.params,
        });
    }

    /**
     * Закрытие контейнера в случае нажатия вне экрана
     * @param {Event} e - событие клика
     */
    clickWithinDiv(e) {
        const container = document.querySelector('.search');
        if (!container.contains(e.target)) {
            container.className = 'search';
        }
    }

    /**
     * Метод закрытия страницы ленты
     */
    close() {
        super.close();
        this.blockButtons();
        document.removeEventListener('mouseup', this.clickWithinDiv);
        document.removeEventListener('click', this.clickWithinTags);
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

    /**
     * Блокирует кнопки, убирает действия по нажатию на кнопки анкеты
     */
    blockButtons() {
        if (this.dislikeBtn) {
            this.dislikeBtn.removeEventListener('click', this.dislikeFunc);
            this.likeBtn.removeEventListener('click', this.likeFunc);
        }
    }

    /**
     * Показывает сообщение о том, что пользователи для ленты закончились
     * @param {object} data - params: фильтры для получения следующего пользователя
     */
    showStub(data) {
        if (data) {
            data.params = this.params;
        }
        super.render(data);
        const searchBtn = this.root.querySelector('#search-btn');
        const searchForm = this.root.querySelector('.search');
        searchBtn.addEventListener('click', () => searchForm.classList.toggle('search_visible'));
        this.addSearchParams();
    }

    /**
     * Показ анкеты лайкнувшего человека
     * @param {Object} user - лайкнувший человек
     */
    showLikedPerson(user) {
        this.user = user;
        super.render({user: user, interests: SETTINGS_LIST.interests});
        const searchBtn = this.root.querySelector('#search-btn');
        const searchForm = this.root.querySelector('.search');
        this.activateBtns();
        searchBtn.addEventListener('click', () => searchForm.classList.toggle('search_visible'));
        this.addSearchParams();
    }

    /**
     * Добавление параметров поиска (фильтров)
     */
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

    /**
     * Закрытие окошка с тегами по клику вне него
     * @param {Event} e - событие клика
     */
    clickWithinTags(e) {
        const container = document.querySelector('.multiselection__input');
        const input = document.querySelector('.multiselection__select-multiple');
        if (!container.contains(e.target) && !input.contains(e.target)) {
            input.style.visibility = 'hidden';
        }
    }

    /**
     * Обеспечивает отрисовку выбора тегов
     */
    selectTags() {
        const input = this.root.querySelector('.multiselection__input');
        input.addEventListener('click', ()=>{
            const tagsInput = document.querySelector('.multiselection__select-multiple');
            tagsInput.style.visibility = 'visible';
            console.log('click');
        });
        document.addEventListener('click', this.clickWithinTags);

        for (let i = 0; i < this.params.tags.length; i++) {
            const elem = this.root.querySelector(`#${SETTINGS_LIST.interests[this.params.tags[i]]}`);
            elem.classList.add('multiselection__selection_active');
        }

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
