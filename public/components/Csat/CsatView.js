import './Csat.scss';
import {CSAT_URL} from '../../lib/constansts';

/**
 * Компонент страницы авторизации (входа)
 */
export class AuthView {
    csatDiv;
    iframe;
    constructor(root, eventBus) {
        this.eventBus = eventBus;
        this.root = root;
        this.template = require('./Csat.hbs');
        this.csatDiv = null;
    }

    render(data) {
        data;
        this.csatDiv = this.fromHTML(this.template({url: CSAT_URL}));
        this.iframe = this.csatDiv.querySelector('iframe');
        this.root.appendChild(this.csatDiv);
    }

    close() {
        this.root.removeChild(this.csatDiv);
        this.csatDiv = null;
        this.iframe = null;
    }

    fromHTML(html, trim = true) {
        html = trim ? html : html.trim();
        if (!html) return null;

        const template = document.createElement('template');
        template.innerHTML = html;
        const result = template.content.children;

        if (result.length === 1) return result[0];
        return result;
    }
}
