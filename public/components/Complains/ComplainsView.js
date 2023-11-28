import {BaseView} from '../BaseView.js';
import {Carousel} from '../Carousel/Carousel.js';
import {COMPLAINTS_EVENTS} from '../../lib/constansts.js';

/**
 * Компонент ленты с кнопками в анкете
 */
export class ComplainsView extends BaseView {
    description;
    parent;
    renderMenu;
    carousel;
    constructor(root, eventBus) {
        super(root, eventBus, require('./Complains.hbs'));
        this.eventBus.on(COMPLAINTS_EVENTS.COMPLAINT_READY, this.render.bind(this));
    }

    render(data) {
        super.render(data);

        if (data && !data.noComplains) {
            this.complainId = data.id;
            const carouselRoot = this.root.querySelector('.form-feed__feed-photo');
            this.carousel = new Carousel(carouselRoot);
            this.carousel.render(data.image_paths);

            this.activateBtns();
        }
    }

    close() {
        super.close();
        this.blockButtons();
    }

    /**
     * Добавляет действия по нажатию на кнопки анкеты
     */
    activateBtns() {
        this.acceptBtn = document.getElementById('accept');
        this.declineBtn = document.getElementById('decline');
        this.acceptFunc = () => {
            this.eventBus.emit(COMPLAINTS_EVENTS.DECLINE_COMPLAINT, this.complainId);
            this.blockButtons();
        };
        this.declineFunc = () => {
            this.eventBus.emit(COMPLAINTS_EVENTS.DECLINE_COMPLAINT, this.complainId);
            this.blockButtons();
        };
        this.acceptBtn.addEventListener('click', this.acceptFunc);
        this.declineBtn.addEventListener('click', this.declineFunc);
    }

    blockButtons() {
        if (this.acceptBtn) {
            this.declineBtn.removeEventListener('click', this.declineBtn);
            this.acceptBtn.removeEventListener('click', this.acceptFunc);
        }
    }
}
