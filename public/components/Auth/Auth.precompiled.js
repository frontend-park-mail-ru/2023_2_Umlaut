(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Auth.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"auth\">\n        <form>\n            <span class=\"text-center\">вход</span>\n            <div class=\"input-container\">\n                <input type=\"text\" required=\"\"/>\n                <label>Логин</label>\n            </div>\n            <div class=\"input-container\">\n                <input type=\"text\" required=\"\"/>\n                <label>Пароль</label>\n            </div>\n            <div class=\"auth-subtitle\">\n                Нет аккаунта? <a href=\"signup.html\">Зарегестрируйтесь</a>\n            </div>\n            <button type=\"button\" class=\"sign-btn\">войти</button>\n        </form>\n</div>";
},"useData":true});
})();