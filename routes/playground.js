var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/flash", (req, res, next) => {
  req.flash("success", "Category Added");
  res.render("playground", {
    title: "Add Category",
    messages: req.flash("success"),
  });
});

router.get("/disp", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
