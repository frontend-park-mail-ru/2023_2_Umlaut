import { Api } from "../../modules/api.js";

export class Menu {
  constructor(items = {},renderOther=()=>{}) {
    this.parent = document.getElementById("root")
    this.RenderOther = renderOther;
    this.items = items
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
        newDiv.className="sidebar";
        newDiv.innerHTML = Handlebars.templates["Menu.hbs"](this.items);
        this.parent.appendChild(newDiv);
        window.addEventListener('popstate', (evn) => {
          // сменить активный элемент
        })
    }
  }
}
