

export class Router {
  constructor(routes = new Map) {
    this.routes = routes;
    this.current = null;
  }

  go(path) {
    console.log("go  " + path)
    if (this.current === path) return;
    this.current = path
    window.history.pushState(null, null, path);
    if (!this.routes.has(path)) {
      //go to 404
      console.log("Not found" + path);
      return;
    }
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
            this.eventBus.publish(GLOBAL_EVENTS.linkClick);
            this.go(linkElement.pathname);
        }
    });

    window.addEventListener('popstate', (evn) => {
      this.go(window.location.pathname);
    })

    this.go(window.location.pathname);
  }
}
