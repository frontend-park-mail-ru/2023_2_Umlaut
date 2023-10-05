export class Description {
    parent;
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * Генерация шаблона описания о фото в анкете пользователя
     * @param {object} user 
     */
    render(user) {
        this.parent.innerHTML = Handlebars.templates['Description.hbs'](user);
    }
}
