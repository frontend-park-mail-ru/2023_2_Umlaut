import { Api } from "../../modules/api.js";

export class Header {
  constructor() {
    this.parent = document.getElementById("root")
  }

  render() {
    const response = Api.user().then(
        (response) => {
          if (response.status === 200) {
            this.renderAuth("/pics/avatar.svg");
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
  }

  renderUnauth() {
    let newDiv = document.createElement('div');
    newDiv.className="anauthorised-header";
    newDiv.innerHTML=Handlebars.templates["UnauthHeader.hbs"]();
    this.parent.appendChild(newDiv);
  }

}
