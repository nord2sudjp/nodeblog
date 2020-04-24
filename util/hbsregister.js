var hbs = require("hbs");
var moment = require("moment");
var path = require("path");

const partialPath = path.join(__dirname, "../views/partials");
hbs.registerPartials(partialPath);

hbs.registerHelper("formatDate", function (date) {
  return moment(date).format("YYYY/MM/DD hh:mm");
});

hbs.registerHelper("select", function (value, options) {
  return options
    .fn(this)
    .split("\n")
    .map(function (v) {
      var t = 'value="' + value + '"';
      //console.log("select: %s-%s", t, v);
      return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"');
    })
    .join("\n");
});

hbs.registerHelper("truncate", (text, length) => {
  var truncatedText = text.substring(0, length);
  return truncatedText;
});
