(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Auth.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form class=\"auth\">\r\n  <span class=\"text-center\">вход</span>\r\n  <div class=\"input-container\">\r\n    <input id=\"login\" type=\"text\" required=\"\" />\r\n    <label>Логин</label>\r\n  </div>\r\n  <div class=\"input-container\">\r\n    <input id=\"password\" type=\"text\" required=\"\" />\r\n    <label>Пароль</label>\r\n  </div>\r\n  <div class=\"auth-subtitle\">\r\n    Нет аккаунта?\r\n    <a href=\"signup.html\">Зарегестрируйтесь</a>\r\n  </div>\r\n  <button type=\"submit\" class=\"sign-btn\">войти</button>\r\n</form>";
},"useData":true});
})();