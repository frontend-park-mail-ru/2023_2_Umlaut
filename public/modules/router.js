

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.current = null;
  }

  go(path) {
    if (this.current === path) return;

    window.history.pushState(null, null, path);
    if (!this.routes.has(path)) {
      //go to 404
      console.log("Not found" + path);
      return;
    }
    this.routes.get(path)();
  }
}
