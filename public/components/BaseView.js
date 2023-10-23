export class BaseView {
    constructor(root, eventBus, tmpl, data = {}) {
        this.eventBus = eventBus;
        this.root = root;
        this.data = data;
        this.tmpl = tmpl;
    }

    render(root = undefined) {
        if (root === undefined) {
            this.root.innerHTML = this.tmpl(this.data);
            return;
        }
        root.innerHTML = this.tmpl(this.data);
    }

    close() {
        this.root.innerHTML = '';
    }
}
