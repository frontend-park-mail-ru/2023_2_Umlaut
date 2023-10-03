(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Header.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <img src=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"img_src") || (depth0 != null ? lookupProperty(depth0,"img_src") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"img_src","hash":{},"data":data,"loc":{"start":{"line":13,"column":22},"end":{"line":13,"column":35}}}) : helper))) != null ? stack1 : "")
    + "\" alt=\"\"/>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n<div class=\"main-page\">\n    <div class=\"logo\">\n        <img src=\"/pics/Umlaut.jpg\">\n    </div>\n    <div class=\"umlaut\">\n        <a href=\"/index\" class=\"link\">Umlaut</a>\n    </div>\n</div>\n<div class=\"profile\">\n    <div class=\"avatar\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"img_src") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":8},"end":{"line":14,"column":15}}})) != null ? stack1 : "")
    + "    </div>\n</div>\n";
},"useData":true});
})();