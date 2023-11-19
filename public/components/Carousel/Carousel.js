import { bind } from 'lodash';
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

    render(images) {
        this.close();

        if(images){
            for (let i = 0; i < images.length; i++) {
                images[i] = images[i].replace("http:/", "https:/");
            }
        }

        this.images = images;
        this.root.innerHTML = this.template({image_paths: images});

        if (!images)
            return;

        this.curIndex = 0;
        this.slider = this.root.querySelector('.carousel__slider');
        this.btnPrev =  this.root.querySelector('.carousel__prev');
        this.btnNext =  this.root.querySelector('.carousel__next');
        if ( this.images.length == 1) {
            this.btnPrev.style.visibility = 'hidden';
            this.btnNext.style.visibility = 'hidden';
        } else {
            this.btnNext.addEventListener('click', this.next.bind(this));
            this.btnPrev.addEventListener('click', this.prev.bind(this));
            this.btnPrev.style.visibility = 'hidden';
        }
    }

    move(index){
        if ( index < 0 || index >= this.images.length )
            return;
        this.slider.style.transform = `translateX(${-index * 100}%)`;
        this.curIndex = index;
    }

    next() {
        if ( this.curIndex === 0 ) 
            this.btnPrev.style.visibility = '';
        if ( this.curIndex === this.images.length - 2) 
            this.btnNext.style.visibility = 'hidden';
        this.move(this.curIndex + 1);
    }

    prev() {
        if ( this.curIndex === this.images.length - 1 ) 
            this.btnNext.style.visibility = '';
        if ( this.curIndex === 1 ) 
            this.btnPrev.style.visibility = 'hidden';
        this.move(this.curIndex - 1);
    }

    current() {
        if ( this.images.length !== 0)
            return this.images[this.curIndex];
        return ''
    }

    delete(photo) {
        const index = this.images.indexOf(photo);
        if ( index !== -1) {
            this.render(this.images.splice(index, 1));
        }
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
