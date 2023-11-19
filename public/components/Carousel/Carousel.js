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

    render(data) {
        this.close();
        if(data.image_paths){
            for (let i = 0; i < data.image_paths.length; i++) {
                data.image_paths[i] = data.image_paths[i].replace("http:/", "https:/");
            }
        }
        this.images = this.image_paths;
        this.root.innerHTML = this.template(data);
        this.slider = this.root.querySelector('.carousel__slider');
        this.btnPrev =  this.root.querySelector('.carousel__prev');
        this.btnNext =  this.root.querySelector('.carousel__next');
        this.curIndex = 0;
    }

    move(index){
        this.slider.style.transform = `translateX(${-index * 100}%)`;
        this.curIndex = index;
    }

    current() {
        return this.images[this.curIndex];
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
