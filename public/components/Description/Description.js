/**
 * Компонент ленты, отвечающий за описание и фото пользователя в анкете
 */
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
        this.parent.innerHTML = window.Handlebars.templates['Description.hbs'](user);
    }
}
