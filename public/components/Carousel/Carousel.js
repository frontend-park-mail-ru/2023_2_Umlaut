import './Carousel.scss';

export class Carousel {
    root;
    template;
    slider;
    btnPrev;
    btnNext;
    images;
    curIndex;


    constructor(root) {
        this.root = root;
        this.template = require('./Carousel.hbs');
    }

    render(images, index = 0) {
        this.close();

        if (images) {
            for (let i = 0; i < images.length; i++) {
                images[i] = images[i].replace('http:/', 'https:/');
            }
        }

        this.images = images;
        this.root.innerHTML = this.template({image_paths: images});

        if (!images) {
            return;
        }

        this.curIndex = index;
        this.slider = this.root.querySelector('.carousel__slider');
        this.btnPrev = this.root.querySelector('.carousel__prev');
        this.btnNext = this.root.querySelector('.carousel__next');
        if ( this.images.length === 1) {
            this.btnPrev.style.visibility = 'hidden';
            this.btnNext.style.visibility = 'hidden';
        } else {
            this.btnNext.addEventListener('click', this.next.bind(this));
            this.btnPrev.addEventListener('click', this.prev.bind(this));
            this.move(index);
        }
    }

    move(index) {
        if ( index < 0 || index >= this.images.length ) {
            return;
        }
        this.btnPrev.style.visibility = index !== 0 ? '' : 'hidden';
        this.btnNext.style.visibility = index === this.images.length - 1 ? 'hidden' : '';
        this.slider.style.transform = `translateX(${-index * 100}%)`;
        this.curIndex = index;
    }

    next() {
        this.move(this.curIndex + 1);
    }

    prev() {
        this.move(this.curIndex - 1);
    }

    current() {
        if ( this.images.length !== 0) {
            return this.images[this.curIndex];
        }
        return '';
    }

    delete(photo) {
        const ind = this.images.indexOf(photo);
        if (ind !== -1) {
            this.images.splice(ind, 1);
            this.render(this.images, ind !== this.images.length ? ind : ind - 1);
        }
    }

    add(photo) {
        this.images.push(photo);
        this.render(this.images, this.images.length - 1);
    }

    close() {

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
