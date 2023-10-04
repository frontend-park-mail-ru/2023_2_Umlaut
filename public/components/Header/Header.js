import {Api} from '../../modules/api.js';
import Handlebars from 'handlebars';

export class Header {
    constructor() {
        this.parent = document.getElementById('root');
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
        newDiv.className='header';
        newDiv.innerHTML=Handlebars.templates['Header.hbs']({imgSrc});
        this.parent.appendChild(newDiv);
    }

    renderUnauth() {
        const newDiv = document.createElement('div');
        newDiv.className='anauthorised-header';
        newDiv.innerHTML=Handlebars.templates['UnauthHeader.hbs']();
        this.parent.appendChild(newDiv);
    }
}
