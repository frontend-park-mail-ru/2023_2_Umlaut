

export class Router {
    constructor(routes = new Map) {
        this.routes = routes;
        this.current = null;
    }

    go(path) {
        if (this.current === path) return;
        this.current = path;
        if (!this.routes.has(path)) {
            this.change('/');
            return;
        }
        window.history.pushState(null, null, path);
        this.change(path);
    }

    change(path) {
        this.routes.get(path)();
    }

    add(path, callback) {
        this.routes.set(path, callback);
    }

    start() {
        document.addEventListener('click', (evt) => {
            const linkElement = evt.target.closest('a');
            if (linkElement) {
                evt.preventDefault();
                this.go(linkElement.pathname);
            }
        });

        window.addEventListener('popstate', () => {
            this.change(window.location.pathname);
        });

        this.go(window.location.pathname);
    }
}
