import { Api } from "../../modules/api.js";

export class Menu {
  constructor(profileCallback = () => {}, messagesCallback = () => {}, notifycationsCallback = () => {}, renderOther=()=>{}) {
    this.parent = document.getElementById("root")
    this.MessagesCallback = messagesCallback;
    this.ProfileCallback = profileCallback;
    this.NotifyCallback = notifycationsCallback;
    this.RenderOther = renderOther;
  }

  render() {
    // const response = Api.feed().then(
    //     (response) => {
    //       if (response.status === 200) {
    //         this.renderAuth("../static/pics/avatar.jpg");
    //       }
    //     }
    // );
    if (true) {
        this.RenderOther();
        let newDiv = document.createElement('div');
        newDiv.className="sidebar"
        newDiv.innerHTML= Handlebars.templates["Menu.hbs"]();
        this.parent.appendChild(newDiv);
        let messagePagePart = this.parent.getElementsByClassName("messages-page")[0];
        let profilePart = this.parent.getElementsByClassName("profile-page")[0];
        let notificationsPart = this.parent.getElementsByClassName("notifications-page")[0];
        notificationsPart.addEventListener("click", this.NotifyCallback.bind(this));
        messagePagePart.addEventListener("click", this.MessagesCallback.bind(this));
        profilePart.addEventListener("click", this.ProfileCallback.bind(this));
    }
  }
}
