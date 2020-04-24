var express = require("express");
var router = express.Router();
var Post = require("../models/post");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const posts = await Post.find({});
  //console.log(posts);
  res.render("index", {
    posts,
    messages: req.flash("success"),
  });
});

module.exports = router;
