/**
 * Компонент ленты, отвечающий за описание и фото пользователя в анкете
 */
export class Description {
    parent;
    constructor(parent) {
        this.parent = parent;
        //this.template = require('./Description.hbs');
    }

    /**
     * Генерация шаблона описания о фото в анкете пользователя
     * @param {object} user
     */
    render(user) {
        this.id = user['id'];
        this.parent.innerHTML = this.template(user);
    }
}
