export class Description {
    parent;
    constructor(parent) {
        this.parent = parent;
    }

    render(user) {
        this.parent.innerHTML = Handlebars.templates['Description.hbs'](user);
    }
}
