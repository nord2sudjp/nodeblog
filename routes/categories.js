var express = require("express");
var router = express.Router();

var multer = require("multer");
upload = multer({ dest: "./uploads" });

var Category = require("../models/category");
var Post = require("../models/post");

const { body, check, validationResult } = require("express-validator");

/* GET users listing. */
router.get("/add", (req, res, next) => {
  res.render("categoryadd", { title: "Add Category" });
});

router.post(
  "/add",
  [check("name").notEmpty().withMessage("Name field is required")],
  async (req, res, next) => {
    const cat = new Category(req.body);
    console.log("/add: Category=", cat);

    const valresult = validationResult(req);
    if (!valresult.isEmpty()) {
      return res.render("categoryadd", {
        category: cat,
        errors: valresult.errors,
      });
    }

    try {
      console.log("/post: cat.save", cat);
      await cat.save();
      req.flash("success", "Category Added");
      res.location("/");
      res.redirect("/");
    } catch (e) {
      console.log(e);
      const errors = [{ msg: e }];
      res.render("categoryadd", { category: cat, errors: errors });
    }
  }
);

router.get("/show/:category", async (req, res, next) => {
  //console.log("/show/:category:", req.params.category);
  var cat = req.params.category;
  var categorytitle = "Category : " + cat;

  try {
    var posts = await Post.find({ category: cat }, {});
    res.render("index", { title: categorytitle, posts });
  } catch (e) {
    const errors = [{ msg: e }];
    res.render("index", { title: categorytitle, errors });
  }
});

module.exports = router;
