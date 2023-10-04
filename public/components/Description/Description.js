import Handlebars from 'handlebars';
export class Description {
    constructor(parent) {
        this.parent = parent;
    }

    render(user) {
        this.parent.innerHTML = Handlebars.templates['Description.hbs'](user);
    }
}
