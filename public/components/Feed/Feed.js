import {Api} from '../../modules/api.js';
import {Description} from '../Description/Description.js';
import Handlebars from 'handlebars';

export class Feed {
    description;
    constructor(goToMessagesCallback = () => {}, renderMenu = () => {}, goLogin) {
        this.parent = document.getElementById('root');
        this.goToMessagesCallback = goToMessagesCallback;
        this.renderMenu = renderMenu;
        this.goLogin = goLogin;

    // this.user = {
    //     name: "Марина",
    //     mail: "stri@.ng",
    //     user_gender: null,
    //     prefer_gender: null,
    //     description: "умная красивая",
    //     age: 20,
    //     looking: "Серьезные отношения",
    //     education: "Высшее",
    //     hobbies: ["чтение", "кулинария"],
    //     tags: ["рак", "прога", "тусовки"]
    //   }
    }

    async getNextPerson() {
        const response = await Api.feed();
        if ( response.status === 200) {
            return response.body;
        } else if ( response.status === 401 ) {
            this.goLogin();
        }
    }

    async render() {
        const resp = await Api.user();
        if ( resp.status === 401 ) {
            this.goLogin();
            return;
        }
        this.parent.innerHTML='';
        this.renderMenu();

        const newDiv = document.createElement('div');
        newDiv.className='main-part';
        newDiv.innerHTML=Handlebars.templates['Feed.hbs']({img_src: '/pics/avatar.png'});
        const userForm = newDiv.getElementsByClassName('userForm')[0];

        const desrDiv = document.createElement('div');
        desrDiv.className='description';
        this.description = new Description(desrDiv);
        userForm.appendChild(desrDiv);

        this.parent.appendChild(newDiv);

        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        const messagesBtn = document.getElementById('messages');
        dislikeBtn.addEventListener('click', () => this.update());
        likeBtn.addEventListener('click', () => this.update());
        messagesBtn.addEventListener('click', this.goToMessagesCallback.bind(this));

        this.update();
    }

    async update() {
        const photo = document.getElementsByClassName('photo')[0];
        photo.innerHTML='<img src=\'/pics/avatar.png\' alt=\'\'/>';
        this.description.render(await this.getNextPerson());
    }
}
