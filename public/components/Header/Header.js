import { Api } from "../../modules/api.js";

export class Header {
  constructor(mainPageCallback = () => {}, authCallback = () => {}, signupCallback = () => {}, profileCallback = () => {}) {
    this.parent = document.getElementById("root")
    this.MainPageCallback = mainPageCallback;
    this.ProfileCallback = profileCallback;
    this.AuthCallback = authCallback;
    this.SignupCallback = signupCallback;
  }

  render() {
    const response = Api.user().then(
        (response) => {
          if (response.status === 200) {
            this.renderAuth("/pics/avatar.jpg");
          }
          else{
            this.renderUnauth();
          }
        }
    );
  }

  renderAuth(img_src = string) {
    let newDiv = document.createElement('div');
    newDiv.className="header";
    newDiv.innerHTML=Handlebars.templates["Header.hbs"]({img_src});
    this.parent.appendChild(newDiv);
    let mainPagePart = this.parent.getElementsByClassName("main-page")[0];
    let profilePart = this.parent.getElementsByClassName("profile")[0];
    mainPagePart.addEventListener("click", this.MainPageCallback.bind(this));
    profilePart.addEventListener("click", this.ProfileCallback.bind(this));
  }

  renderUnauth() {
    let newDiv = document.createElement('div');
    newDiv.className="anauthorised-header";
    newDiv.innerHTML=Handlebars.templates["UnauthHeader.hbs"]();
    this.parent.appendChild(newDiv);
    let auth = this.parent.getElementsByClassName("signin")[0];
  
    let signup = this.parent.getElementsByClassName("signup")[0];
    auth.addEventListener("click", this.AuthCallback.bind(this));
    signup.addEventListener("click", this.SignupCallback.bind(this));
  }

}
