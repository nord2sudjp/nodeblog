var express = require("express");
var router = express.Router();

var multer = require("multer");
upload = multer({ dest: "./public/uploads" }); // このパスはURLではなくOS側のフォルダ構造

var Post = require("../models/post");
var Category = require("../models/category");

const { body, check, validationResult } = require("express-validator");

/* GET users listing. */
router.get("/add", async (req, res, next) => {
  var cats = await getCategoriesAll();
  //console.log("/add: cats", cats);
  res.render("postadd", { title: "Add Post", categories: cats });
});

getCategoriesAll = async () => {
  var cats = {};
  try {
    cats = await Category.find({}, {});
    //console.log("/posts/add: Categories found ", cats);
  } catch (e) {
    console.log("/posts/add: Categories not found");
  }
  //console.log("/add: cats", cats);
  return cats;
};

router.post(
  "/add",
  upload.single("mainimage"),
  [
    check("title").notEmpty().withMessage("Title field is required"),
    check("body").notEmpty().withMessage("Body field is required"),
  ],
  async (req, res, next) => {
    // console.log("/add: req.body=", req.body, req.file);

    var mainimage = "noimage.jpg";
    if (req.file) {
      mainimage = req.file.filename;
    }

    const fields = { ...req.body, image: mainimage };
    const post = new Post(fields);
    // console.log("/add: Post=", post);

    const valresult = validationResult(req);
    if (!valresult.isEmpty()) {
      // console.log("/add:Validation:", valresult.errors);
      res.locals.categories = await getCategoriesAll();
      return res.render("postadd", { post, errors: valresult.errors });
    }

    try {
      await post.save();
      req.flash("success", "Post Added");
      res.location("/");
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.locals.categories = await getCategoriesAll();
      const errors = [{ msg: e }];
      res.render("postadd", { post, errors: errors });
    }
  }
);

router.get("/show/:id", async (req, res, next) => {
  // :以下はパラメータになるためにパスを設定できない。
  var id = req.params.id;
  try {
    var post = await Post.findById(id, {}); // これは戻り値が配列なのでpostsになる。hbsに引き渡した場合には#eachが必要

    // var post = await Post.find({ _id: id }, {}); // これは戻り値が配列なのでpostsになる。hbsに引き渡した場合には#eachが必要

    //console.log("/show/:id", post);
    res.render("show", { post: post, title: post.title });
  } catch (e) {
    console.log(e);
    const errors = [{ msg: e }];
    res.render("show", { errors });
  }
});

router.post(
  "/addcomment",
  [
    check("name").notEmpty().withMessage("Name field is required"),
    check("body").notEmpty().withMessage("Body field is required"),
  ],
  async (req, res, next) => {
    var id = req.body.id;
    const valresult = validationResult(req);
    if (!valresult.isEmpty()) {
      var post = getPost(id);
      return res.render("show", { post: post, title: post.title });
    }

    try {
      var post = await Post.findById(id, {});
      // console.log("/addcomment:", post);

      var comment = {
        name: req.body.name,
        email: req.body.email,
        body: req.body.body,
      };
      //console.log("/addcomment:", comment);
      //var newcomment = await post.comments.create(comment);
      post.comments.push(comment);
      var newcomment = post.comments[0];
      //console.log("/addcomment:comment created"newcomment);
      newcomment.isNew;
      //console.log("/addcomment:before save", post);
      await post.save();
      var post = await getPost(id); //awaitを入れないとさきに進んでしまう。
      //console.log("/addcomment:after save", post);
      req.flash("success", "Comment Added");
      res.location("/posts/show" + id);
      res.redirect("/posts/show" + id);

      //return res.render("show", { post: post, title: post.title });
    } catch (e) {
      console.log(e);
      const errors = [{ msg: e }];
      return res.render("show", { post: post, title: post.title, errors });
    }
  }
);

getPost = async (id) => {
  try {
    var post = await Post.findById(id, {});
    return post;
  } catch (e) {
    console.log(e);
  }
  return;
};

router.get("/delete", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
