var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  commentbody: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
