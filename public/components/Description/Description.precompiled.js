(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Description.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"user-name\">\n    "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + ", "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"age") : depth0), depth0))
    + "\n</div>\n<div class=\"about-user\">\n    <span class=\"me\">\n        О себе:\n    </span>\n    <span class=\"me\">\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"description") : depth0), depth0))
    + "\n    </span>\n    <span class=\"goal\">\n        Цель:\n    </span>\n    <span class=\"goal\">\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"looking") : depth0), depth0))
    + "\n    </span>\n    <span class=\"education\">\n        Образование:\n    </span>\n    <span class=\"education\">\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"education") : depth0), depth0))
    + "\n    </span>\n    <span class=\"interests\">\n        Увлечения:\n    </span>\n    <span class=\"interests\">\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"hobbies") : depth0), depth0))
    + "\n    </span>\n    <span class=\"tags\">\n        Теги:\n    </span>\n    <span class=\"tags\">\n        "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tags") : depth0), depth0))
    + "\n    </span>\n</div>";
},"useData":true});
})();