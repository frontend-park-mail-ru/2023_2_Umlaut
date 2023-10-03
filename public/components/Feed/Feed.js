import { Api } from "../../modules/api.js";

export class Feed {
  constructor(desc, goToMessagesCallback = () => {}, renderMenu = () => {}) {
    this.parent = document.getElementById("root")
    this.GoToMessagesCallback = goToMessagesCallback;
    this.Desc = desc;
    this.RenderMenu = renderMenu;

    this.user = {
        name: "Марина",
        mail: "stri@.ng",
        user_gender: null,
        prefer_gender: null,
        description: "умная красивая",
        age: 20,
        looking: "Серьезные отношения",
        education: "Высшее",
        hobbies: ["чтение", "кулинария"],
        tags: ["рак", "прога", "тусовки"]
      }
  }

  getNextPerson(){
    const response = Api.feed().then(
      (response) => {
        if (response.status === 200) {
          return response.parsedJson;
        }
      }
    );
  }

  render() {
    const response = Api.user().then(
        (response) => {
          if (response.status === 200) {
            this.parent.innerHTML="";
            this.RenderMenu();
            let newDiv = document.createElement('div');
            newDiv.className="main-part";
            newDiv.innerHTML=Handlebars.templates["Feed.hbs"]({img_src:"/pics/avatar.jpg"});
            let userForm = newDiv.getElementsByClassName("userForm")[0]
            userForm.appendChild(this.Desc.render(this.getNextPerson()))
            this.parent.appendChild(newDiv);
            let dislikeBtn = document.getElementById("dislike");
            let likeBtn = document.getElementById("like");
            let messagesBtn = document.getElementById("messages");
            dislikeBtn.addEventListener("click", this.update.bind(this));
            likeBtn.addEventListener("click", this.update.bind(this));
            messagesBtn.addEventListener("click", this.GoToMessagesCallback.bind(this));
          }
          else{
            
          }
        }
    );
  }

  update() {
    let photo = document.getElementsByClassName("photo")[0]
    photo.innerHTML="<img src='/pics/avatar.jpg' alt=''/>";
    let userForm = document.getElementsByClassName("userForm")[0]
    userForm.removeChild(userForm.getElementsByClassName("description")[0])
    userForm.appendChild(this.Desc.render(this.getNextPerson()))
    this.parent.appendChild(newDiv);
  }
}
