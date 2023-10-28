export class BaseView {
    constructor(root, eventBus, tmpl) {
        this.eventBus = eventBus;
        this.root = root;
        this.tmpl = tmpl;
    }

    render(data={}, root = undefined) {
        if (root === undefined) {
            this.root.innerHTML = this.tmpl(data);
            return;
        }
        root.innerHTML = this.tmpl(data);
    }

    close() {
        this.root.innerHTML = '';
    }
}
