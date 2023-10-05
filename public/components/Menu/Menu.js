import {Api} from '../../modules/api.js';

export class Menu {
    parent;
    renderOther;
    item;
    constructor(items = {}, renderOther=()=>{}) {
        this.parent = document.getElementById('root');
        this.renderOther = renderOther;
        this.item = items;

        this.state = {
            activeMenu: null,
            menuElements: {},
        };
    }

    render() {
        Api.user().then(
            (response) => {
                this.renderOther();
                if (response.status === 200) {
                    const newDiv = document.createElement('div');
                    newDiv.className ='sidebar';
                    newDiv.innerHTML = Handlebars.templates['Menu.hbs']({items: this.item});
                    this.parent.appendChild(newDiv);
                }
            },
        );
    }
}
