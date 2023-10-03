(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Auth.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form class=\"auth\">\n  <span class=\"text-center\">вход</span>\n  <div class=\"input-container\">\n    <input id=\"mail\" type=\"text\" required=\"\" />\n    <label>E-mail</label>\n  </div>\n  <div class=\"input-container\">\n    <input id=\"password\" type=\"password\" required=\"\" />\n    <label>Пароль</label>\n  </div>\n  <div class=\"error-label\">1</div>\n  <div class=\"auth-subtitle\">\n    Нет аккаунта?\n    <a href=\"/signup\">Зарегестрируйтесь</a>\n  </div>\n  <button type=\"submit\" class=\"sign-btn\">войти</button>\n</form>";
},"useData":true});
})();