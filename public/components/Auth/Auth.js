import { Ajax, URLS, BACKEND_URL } from "../../modules/ajax.js";

export class Auth {
  constructor(parent = document.body, submitCallback = () => {}) {
    this.parent = parent;
    this.SubmitCallback = submitCallback;
    this.form = null;
  }

  render() {
    this.parent.innerHTML = Handlebars.templates["Auth.hbs"]();
    this.form = this.parent.getElementsByClassName("auth")[0];
    this.form.addEventListener("submit", this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();
    //validation

    const inputs = this.form.querySelectorAll("input")
    const inputsValue = {};
    inputs.forEach((input) => {
      inputsValue[input.id] = input.value;
    });

    const response = Ajax.post(BACKEND_URL + URLS.login, inputsValue);
    if (response.status < 300) this.SubmitCallback();
  }
}
