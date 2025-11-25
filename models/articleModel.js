const mongoose = require("mongoose");
const Users = require("../models/userModel");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");
const schema = new mongoose.Schema(
  {
    slug: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      default: "Not mentioned anything",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    likes: [
      {type:mongoose.Schema.Types.ObjectId,ref:"users"}
  ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);
schema.plugin(uniqueValidator);

// Add text index for efficient full-text search (much faster than regex)
schema.index({ title: "text", body: "text" });

schema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      replacement: "-",
    });
  }
  next();
});
schema.methods.toArticleResponse = async function (author) {
  console.log(author);
  // const authorObj=await Users.findById(id);
  return {
    slug: this.slug,
    title: this.title,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    likes: this.likes,
    author: author.toProfileJSON(),
  };
};
const model = mongoose.model("articles", schema);
module.exports = model;
