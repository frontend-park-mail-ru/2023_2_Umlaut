import { Api } from "../../modules/api.js";

export class Auth {
  constructor(parent = document.body, submitCallback = () => {}) {
    this.parent = parent;
    this.SubmitCallback = submitCallback;
    this.form = null;
    this.errorLabel = null
  }

  render() {
    this.parent.innerHTML = Handlebars.templates["Auth.hbs"]();
    this.form = this.parent.getElementsByClassName("auth")[0];
    this.form.addEventListener("submit", this.onSubmit.bind(this));
    this.errorLabel = this.form.getElementsByClassName("error-label")[0];
    this.errorLabel.style.visibility = "hidden"; 
  }

  onSubmit(event) {
    event.preventDefault();
    //validation

    const inputs = this.form.querySelectorAll("input");
    const inputsValue = {};
    inputs.forEach((input) => {
      inputsValue[input.id] = input.value;
    });

    Api.login(inputsValue).then(
      (response) => {
        if (response.status < 300) {
          this.SubmitCallback();
        } else {
          this.showError("Невeрный email или пароль")
        }
      }
    );
  }

  showError(message){
    this.errorLabel.style.visibility = "visible";
    this.errorLabel.innerHTML = message; 
  }
}
