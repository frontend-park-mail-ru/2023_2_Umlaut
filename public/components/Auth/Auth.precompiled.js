(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Auth.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form class=\"auth\">\n  <span class=\"text-center\">вход</span>\n  <div class=\"input-container\">\n    <input id=\"mail\" type=\"text\" required=\"\" />\n    <label>Логин</label>\n  </div>\n  <div class=\"input-container\">\n    <input id=\"password\" type=\"text\" required=\"\" />\n    <label>Пароль</label>\n  </div>\n  <div class=\"auth-subtitle\">\n    Нет аккаунта?\n    <a href=\"signup.html\">Зарегестрируйтесь</a>\n  </div>\n  <button type=\"submit\" class=\"sign-btn\">войти</button>\n</form>";
},"useData":true});
})();