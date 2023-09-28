


export class Auth {
  constructor(parent = document.body) {
    this.parent = parent;
  }

  renderAuth() {
    this.parent.innerHTML = Handlebars.templates['Auth.hbs']();
  }

  renderSignup() {}
}
