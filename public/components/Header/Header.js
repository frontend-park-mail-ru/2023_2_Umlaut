import {Api} from '../../modules/api.js';

/**
 * Компонент хедер для всех страниц
 */
export class Header {
    parent;
    logoutCallback;
    constructor(logoutCallback = () => {}) {
        this.parent = document.getElementById('root');
        this.logoutCallback = logoutCallback;
    }

    /**
     * Отрисовка хедера по шаблону. Разные варианты для авторизованных и неавторизованных пользователей
     */
    render() {
        Api.user().then(
            (response) => {
                if (response.status === 200) {
                    this.renderAuth('/pics/avatar.png');
                } else {
                    this.renderUnauth();
                }
            },
        );
    }

    /**
     * Отрисовка хедера для авторизованных пользователей
     * @param {string} imgSrc - аватарка пользователя
     */
    renderAuth(imgSrc) {
        const newDiv = document.createElement('div');
        newDiv.className = 'header';
        newDiv.innerHTML = window.Handlebars.templates['Header.hbs']({img_src: imgSrc});
        const logout = newDiv.querySelector('.logout-header');
        logout.addEventListener('click', () => this.logoutCallback());
        this.parent.appendChild(newDiv);
    }

    /**
     * Отрисовка хедера для неавторизованных пользователей
     */
    renderUnauth() {
        const newDiv = document.createElement('div');
        newDiv.className = 'anauthorised-header';
        newDiv.innerHTML = window.Handlebars.templates['UnauthHeader.hbs']();
        this.parent.appendChild(newDiv);
    }
}
