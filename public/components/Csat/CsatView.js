import './Csat.scss';
import {CSAT_URL} from '../../lib/constansts';
import {fromHTML} from '../../lib/util';

/**
 * Компонент страницы авторизации (входа)
 */
export class CsatView {
    csatDiv;
    iframe;
    constructor(root, eventBus) {
        this.eventBus = eventBus;
        this.root = root;
        this.template = require('./Csat.hbs');
        this.csatDiv = null;
        this.onMessageEvent = this.onMessage.bind(this);
    }

    onMessage(event) {
        if (event.origin !== window.location.origin) {
            return;
        }

        if ( event.data === 'close') {
            this.close();
        }
    }

    render(data) {
        this.csatDiv = fromHTML(this.template({url: window.location.origin + CSAT_URL}));
        this.iframe = this.csatDiv.querySelector('iframe');
        this.iframe.onload = () => this.iframe.contentWindow.postMessage(data, window.location.origin);
        this.iframe.onerror = () => this.close();
        window.addEventListener('message', this.onMessageEvent);
        this.root.appendChild(this.csatDiv);
    }

    close() {
        if ( this.csatDiv === null) {
            return;
        }
        window.removeEventListener('message', this.onMessageEvent);
        this.root.removeChild(this.csatDiv);
        this.csatDiv = null;
        this.iframe = null;
    }
}
