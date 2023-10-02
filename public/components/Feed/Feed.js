import { Api } from "../../modules/api.js";

export class Feed {
  constructor(desc, goToMessagesCallback = () => {}, nextPersonCallback = () => {}) {
    this.parent = document.getElementById("root")
    this.GoToMessagesCallback = goToMessagesCallback;
    this.Desc = desc;
    this.NextPersonCallback = nextPersonCallback;

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

  render() {
    // const response = Api.feed().then(
    //     (response) => {
    //       if (response.status === 200) {
    //         this.renderAuth("../static/pics/avatar.jpg");
    //       }
    //       else{
    //         
    //       }
    //     }
    // );
    if (true) {
        let newDiv = document.createElement('div');
        newDiv.className="main-part";
        newDiv.innerHTML=Handlebars.templates["Feed.hbs"]({img_src:"/pics/avatar.jpg"});
        let userForm = newDiv.getElementsByClassName("userForm")[0]
        userForm.appendChild(this.Desc.render(this.user))
        this.parent.appendChild(newDiv);
        let dislikeBtn = document.getElementById("dislike");
        let likeBtn = document.getElementById("like");
        let messagesBtn = document.getElementById("messages");
        dislikeBtn.addEventListener("click", this.NextPersonCallback.bind(this));
        likeBtn.addEventListener("click", this.NextPersonCallback.bind(this));
        messagesBtn.addEventListener("click", this.GoToMessagesCallback.bind(this));
    }
  }
}
