import {Api} from '../../modules/api.js';

export class Header {
    parent;
    logoutCallback;
    constructor(logoutCallback = () => {}) {
        this.parent = document.getElementById('root');
        this.logoutCallback = logoutCallback;
    }

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

    renderAuth(imgSrc) {
        const newDiv = document.createElement('div');
        newDiv.className ='header';
        newDiv.innerHTML = Handlebars.templates['Header.hbs']({img_src:imgSrc});
        let logout = newDiv.querySelector(".logout-header");
        logout.addEventListener('click', () => this.logoutCallback());
        this.parent.appendChild(newDiv);
    }

    renderUnauth() {
        const newDiv = document.createElement('div');
        newDiv.className = 'anauthorised-header';
        newDiv.innerHTML = Handlebars.templates['UnauthHeader.hbs']();
        this.parent.appendChild(newDiv);
    }
}
