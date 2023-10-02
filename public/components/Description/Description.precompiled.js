(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Description.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"user-name\">\r\n    "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + ", "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"age") : depth0), depth0))
    + "\r\n</div>\r\n<div class=\"about-user\">\r\n    <span class=\"me\">\r\n        О себе:\r\n    </span>\r\n    <span class=\"me\">\r\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"description") : depth0), depth0))
    + "\r\n    </span>\r\n    <span class=\"goal\">\r\n        Цель:\r\n    </span>\r\n    <span class=\"goal\">\r\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"looking") : depth0), depth0))
    + "\r\n    </span>\r\n    <span class=\"education\">\r\n        Образование:\r\n    </span>\r\n    <span class=\"education\">\r\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"education") : depth0), depth0))
    + "\r\n    </span>\r\n    <span class=\"interests\">\r\n        Увлечения:\r\n    </span>\r\n    <span class=\"interests\">\r\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"hobbies") : depth0), depth0))
    + "\r\n    </span>\r\n    <span class=\"tags\">\r\n        Теги:\r\n    </span>\r\n    <span class=\"tags\">\r\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tags") : depth0), depth0))
    + "\r\n    </span>\r\n</div>";
},"useData":true});
})();