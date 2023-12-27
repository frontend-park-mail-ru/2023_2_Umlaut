import './Carousel.scss';

/**
 * Класс отображения нескольких фототграфий пользователя
 */
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

    /**
     * Рендер фотографий (карусели)
     * @param {array} images - ссылки на фотографии пользователя
     * @param {int} index - номер фотографии, которая должна быть сейчас показана
     */
    render(images, index = 0) {
        this.close();
        images = images ? images : [];
        this.images = images;
        if (images) {
            for (let i = 0; i < images.length; i++) {
                images[i] = images[i].replace('http:/', 'https:/');
            }
        }

        this.root.innerHTML = this.template({image_paths: images});

        if (!images || images.length < 1) {
            return;
        }
        this.curIndex = undefined;
        this.slider = this.root.querySelector('.carousel__slider');
        this.btnPrev = this.root.querySelector('.carousel__prev');
        this.btnNext = this.root.querySelector('.carousel__next');
        this.bullets = this.root.querySelector('.carousel__bullets');
        if ( this.images.length === 1) {
            this.btnPrev.style.visibility = 'hidden';
            this.btnNext.style.visibility = 'hidden';
            this.bullets.style.visibility = 'hidden';
            this.curIndex = 0;
        } else {
            this.btnNext.addEventListener('click', this.next.bind(this));
            this.btnPrev.addEventListener('click', this.prev.bind(this));
            this.bullets.addEventListener('click', this.bulletsClick.bind(this));
            this.move(index);
        }
    }

    /**
     * Перелистнуть фотографию
     * @param {int} index - номер фотграфии на которую нужно перелистнуть
     */
    move(index) {
        if ( index < 0 || index >= this.images.length ) {
            return;
        }
        if (this.curIndex !== undefined) {
            const bullet = this.bullets.querySelector(`[data-bullet-index="${this.curIndex}"]`);
            bullet.classList.toggle('carousel__bullet--active');
            bullet.firstElementChild.classList.toggle('carousel__bullet-circle--big');
        }
        const bullet = this.bullets.querySelector(`[data-bullet-index="${index}"]`);
        bullet.classList.toggle('carousel__bullet--active');
        bullet.firstElementChild.classList.toggle('carousel__bullet-circle--big');

        this.btnPrev.style.visibility = index !== 0 ? '' : 'hidden';
        this.btnNext.style.visibility = index === this.images.length - 1 ? 'hidden' : '';
        this.slider.style.transform = `translateX(${-index * 100}%)`;
        this.curIndex = index;
    }

    bulletsClick(e) {
        if (!e.target.classList.contains('carousel__bullet') &&
            !e.target.classList.contains('carousel__bullet-circle')) {
            return;
        }

        this.move(parseInt(e.target.dataset.bulletIndex));
    }

    /**
     * Перелистнуть на одну фотографию вперед
     */
    next() {
        this.move(this.curIndex + 1);
    }

    /**
     * Перелистнуть на одну фотографию назад
     */
    prev() {
        this.move(this.curIndex - 1);
    }

    /**
     * Определить, какая фотография сейчас отображена
     * @return {string} - ссылка на фотографию
     */
    current() {
        if ( this.images.length !== 0) {
            return this.images[this.curIndex];
        }
        return '';
    }

    /**
     * Удалить фотографию из карусели
     * @param {string} photo - ссылка на фотографию которую нужно удалить
     */
    delete(photo) {
        const ind = this.images.indexOf(photo);
        if (ind !== -1) {
            this.images.splice(ind, 1);
            this.render(this.images, ind !== this.images.length ? ind : ind - 1);
        }
    }

    /**
     * Добавить фотографию в карусель
     * @param {string} photo - ссылка на фотографию которую нужно добавить
     */
    add(photo) {
        this.images.push(photo);
        this.render(this.images, this.images.length - 1);
    }

    close() {}

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
