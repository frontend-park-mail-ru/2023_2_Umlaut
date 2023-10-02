export class Description {
    constructor() {
    }
      render(user) {
          let newDiv = document.createElement('div');
          newDiv.className="description";
          newDiv.innerHTML=Handlebars.templates["Description.hbs"](user);
          return newDiv
      }
  }
  