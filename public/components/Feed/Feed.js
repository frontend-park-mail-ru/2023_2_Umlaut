import {Api} from '../../modules/api.js';
import {Description} from '../Description/Description.js';

export class Feed {
    description;
    parent;
    goToMessagesCallback;
    renderMenu;
    goLogin;
    constructor(goToMessagesCallback = () => {}, renderMenu = () => {}, goLogin) {
        this.parent = document.getElementById('root');
        this.goToMessagesCallback = goToMessagesCallback;
        this.renderMenu = renderMenu;
        this.goLogin = goLogin;
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
        const userForm = newDiv.querySelector('.userForm');

        const desrDiv = document.createElement('div');
        desrDiv.className='description';
        this.description = new Description(desrDiv);
        userForm.appendChild(desrDiv);

        this.parent.appendChild(newDiv);

        this.addSwipeBtns();

        this.update();
    }

    addSwipeBtns(){
        const dislikeBtn = document.getElementById('dislike');
        const likeBtn = document.getElementById('like');
        const messagesBtn = document.getElementById('messages');
        dislikeBtn.addEventListener('click', () => this.update());
        likeBtn.addEventListener('click', () => this.update());
        messagesBtn.addEventListener('click', this.goToMessagesCallback.bind(this));
    }

    async update() {
        const photo = document.querySelector('.photo img');
        photo.src='/pics/avatar.png';
        this.description.render(await this.getNextPerson());
    }
}
