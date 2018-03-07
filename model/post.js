'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  siteName: String,
  title: String,
  url: String,
  author: String,
  datePublished: { type: Date, default: Date.now },
  dateFormated: String,
  category: String
});

const Post = mongoose.model('Post', schema);
module.exports = Post;