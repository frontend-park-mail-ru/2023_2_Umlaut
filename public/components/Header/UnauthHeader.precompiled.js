(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['UnauthHeader.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\n    <div class=\"menu\">\n        <a class=\"logo\" href=\"/\"><img src=\"/pics/Umlaut.jpg\" alt=\"logo\"></a>\n        <div class=\"name\"><a href=\"/\">Umlaut</a></div>\n        <div class=\"about\"><a href=\"\">О нас</a></div>\n        <div class=\"login signin\"><a href=\"/auth\">Войти</a></div>\n        <div class=\"signup\"><a href=\"/singup\">Регистрация</a></div>\n    </div>\n";
},"useData":true});
})();