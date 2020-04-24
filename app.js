var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var flash = require("connect-flash");
var session = require("express-session");
var moment = require("moment");

var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");
var categoriesRouter = require("./routes/categories");
var playgroundRouter = require("./routes/playground");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
require("./util/hbsregister");

app.use(logger("dev"));
app.use(express.json({ type: "application/*+json" }));
app.use(
  express.urlencoded({
    extended: false,
    type: "application/x-www-form-urlencoded",
  })
);

app.use(cookieParser());

// Static path
app.use(express.static(path.join(__dirname, "public")));

// Connect-flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  console.log("flash", res.locals.messages);
  next();
});

// Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

// Database
require("./db/mongoose");

// Routing
app.use("/", indexRouter);
app.use("/posts", postsRouter);
app.use("/categories", categoriesRouter);
app.use("/playground", playgroundRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
