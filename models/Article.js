var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  URL: {
    type: String,
    unique: true
  },
  comment: [
    {
    type: Schema.Types.ObjectId,
    ref: "Comment"
    }
  ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
