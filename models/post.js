const mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
  name: "string",
  email: "string",
  body: "string",
});
const postSchema = new mongoose.Schema({
  title: String,
  category: String,
  author: String,
  body: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  image: String,
  comments: [commentSchema],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
