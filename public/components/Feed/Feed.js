import { Api } from "../../modules/api.js";
import { Description } from "../Description/Description.js";

export class Feed {
  description
  constructor(goToMessagesCallback = () => {}, renderMenu = () => {}, goLogin) {
    this.parent = document.getElementById("root")
    this.goToMessagesCallback = goToMessagesCallback;
    this.renderMenu = renderMenu;
    this.goLogin = goLogin;

    // this.user = {
    //     name: "Марина",
    //     mail: "stri@.ng",
    //     user_gender: null,
    //     prefer_gender: null,
    //     description: "умная красивая",
    //     age: 20,
    //     looking: "Серьезные отношения",
    //     education: "Высшее",
    //     hobbies: ["чтение", "кулинария"],
    //     tags: ["рак", "прога", "тусовки"]
    //   }
  }

  async getNextPerson(){
    const response = await Api.feed();
    if ( response.status === 200)
      return response.body;
    else if ( response.status === 401 ){
      this.goLogin();
    }
  }

  async render() {
    const resp = await Api.user()
    if( resp.status === 401 ){
      this.goLogin();
      return;
    }
    this.parent.innerHTML="";
    this.renderMenu();

    let newDiv = document.createElement('div');
    newDiv.className="main-part";
    newDiv.innerHTML=Handlebars.templates["Feed.hbs"]({img_src:"/pics/avatar.png"});
    let userForm = newDiv.getElementsByClassName("userForm")[0]

    let desrDiv = document.createElement('div');
    desrDiv.className="description";
    this.description = new Description(desrDiv)
    userForm.appendChild(desrDiv)

    this.parent.appendChild(newDiv);

    let dislikeBtn = document.getElementById("dislike");
    let likeBtn = document.getElementById("like");
    let messagesBtn = document.getElementById("messages");
    dislikeBtn.addEventListener("click", () => this.update());
    likeBtn.addEventListener("click", () => this.update());
    messagesBtn.addEventListener("click", this.goToMessagesCallback.bind(this));

    this.update()
  }

  async update() {
    let photo = document.getElementsByClassName("photo")[0]
    photo.innerHTML="<img src='/pics/avatar.png' alt=''/>";
    this.description.render(await this.getNextPerson())
  }
}
