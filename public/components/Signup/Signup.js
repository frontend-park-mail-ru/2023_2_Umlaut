import { Api } from "../../modules/api.js";

export class Signup {
  constructor(parent = document.body, submitCallback = () => { }) {
    this.parent = parent;
    this.SubmitCallback = submitCallback;
    this.form = null;
  }

  render() {
    this.parent.innerHTML = Handlebars.templates["Signup.hbs"]();
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

    Api.Signup(inputsValue).then(response => {
      if (response.status < 300) this.SubmitCallback();
    })
  }
}
