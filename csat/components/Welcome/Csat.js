import "./Csat.scss"
export class Csat {
    constructor(root) {
        this.root = root;
        this.general = require('./General.hbs');
        this.choose = require('./Choose.hbs');
    }

    /**
     * Рендер страницы авторизации
     */
    renderGeneral() {
        this.root.innerHTML = this.general();
    }

    close() {
        super.close();
    }
}