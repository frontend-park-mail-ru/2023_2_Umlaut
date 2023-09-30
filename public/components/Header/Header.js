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
    // const response = Api.feed().then(
    //     (response) => {
    //       if (response.status === 200) {
    //         this.renderAuth("../static/pics/avatar.jpg");
    //       }
    //       else{
    //         this.renderUnauth();
    //       }
    //     }
    // );
    if (true) {
        this.renderAuth("/pics/avatar.jpg");
    }
    else{
        this.renderUnauth();
    }
  }

  renderAuth(img_src = string) {
    this.parent.innerHTML = Handlebars.templates["Header.hbs"]({img_src});
    let mainPagePart = this.parent.getElementsByClassName("main-page")[0];
    let profilePart = this.parent.getElementsByClassName("profile")[0];
    mainPagePart.addEventListener("click", this.MainPageCallback.bind(this));
    profilePart.addEventListener("click", this.ProfileCallback.bind(this));
  }

  renderUnauth() {
    this.parent.innerHTML = Handlebars.templates["UnauthHeader.hbs"]();
    let auth = this.parent.getElementsByClassName("signin")[0];
    let signup = this.parent.getElementsByClassName("signup")[0];
    auth.addEventListener("click", this.AuthCallback.bind(this));
    signup.addEventListener("click", this.SignupCallback.bind(this));
  }

}
