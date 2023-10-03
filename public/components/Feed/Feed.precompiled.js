(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['Feed.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <img src=\""
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"img_src") || (depth0 != null ? lookupProperty(depth0,"img_src") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"img_src","hash":{},"data":data,"loc":{"start":{"line":6,"column":26},"end":{"line":6,"column":39}}}) : helper))) != null ? stack1 : "")
    + "\" alt=\"\"/>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"greetings\">Подобрали кое-кого для вас:</div>\n<div class=\"userForm\">\n    <div class=\"photo-part\">\n        <div class=\"photo\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"img_src") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":12},"end":{"line":7,"column":19}}})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"form-btn\">\n            <img src=\"pics/dislike.png\" id=\"dislike\">\n            <img src=\"pics/like.png\" id=\"like\">\n            <img src=\"pics/message.png\" id=\"messages\">\n        </div>\n    </div>\n</div>";
},"useData":true});
})();