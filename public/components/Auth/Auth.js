import { Api } from "../../modules/api.js";
import { Validate } from "../../modules/validate.js";

export class Auth {
  
  form
  errorLabel
  mailInput

  constructor(parent = document.body, submitCallback = () => {}) {
    this.parent = parent;
    this.SubmitCallback = submitCallback;
  }

  render() {
    this.parent.innerHTML = Handlebars.templates["Auth.hbs"]();
    this.form = this.parent.getElementsByClassName("auth")[0];
    this.form.addEventListener("submit", this.onSubmit.bind(this));
    this.errorLabel = this.form.getElementsByClassName("error-label")[0];
    this.errorLabel.style.visibility = "hidden";
    this.form.querySelectorAll("input").forEach((input) => {
      if (input.id === "mail")
        this.mailInput = input;
    })
    this.mailInput.addEventListener('change', (ev)=>{
      this.validateMail();
    })
  }

  validateMail(){
    if(Validate.Email(this.mailInput.value)){
      this.hideError()
      return true
    }else{
      this.showError("incorrect Email")
      return false
    }
  }

  onSubmit(event) {
    event.preventDefault();
    
    if( !this.validateMail())
      return

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

  hideError(){
    this.errorLabel.style.visibility = "hidden";
  }

  showError(message){
    this.errorLabel.style.visibility = "visible";
    this.errorLabel.innerHTML = message; 
  }
}
