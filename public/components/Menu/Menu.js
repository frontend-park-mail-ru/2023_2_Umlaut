import {Api} from '../../modules/api.js';
import Handlebars from 'handlebars';

export class Menu {
    constructor(items = {}, renderOther=()=>{}) {
        this.parent = document.getElementById('root');
        this.RenderOther = renderOther;
        this.item = items;

        this.state = {
            activeMenu: null,
            menuElements: {},
        };
    }

    render() {
        Api.user().then(
            (response) => {
                this.RenderOther();
                if (response.status === 200) {
                    const newDiv = document.createElement('div');
                    newDiv.className='sidebar';
                    newDiv.innerHTML = Handlebars.templates['Menu.hbs']({items: this.item});
                    this.parent.appendChild(newDiv);
                }
            },
        );
    }
}
