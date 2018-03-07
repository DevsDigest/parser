'use strict';

require('./infra/database');
const feedRead = require('feed-read');
const Post = require('./model/post');
const feedsData = require('./data/feeds');
const async = require('async');
const moment = require('moment');
const posts = [];

const allFeeds = feedsData.map((feed) => feed);

function parserFeeds() {
  async.each(allFeeds, function(feed, callback) {
    let url = feed.url;
    let category = feed.category;

    parser(url, category, callback);

  }, function(err) {
    if (err) throw err;
    savePosts();
  });
}

function parser(url, category, callback) {
  feedRead(url, function(err, article) {
    if (err) throw err;

    posts.push({
      site_name: article[0].feed.name,
      title: article[0].title,
      url: article[0].link,
      author: article[0].author,
      category: category,
      date_published: article[0].published,
      date_formated: moment(article[0].published).format('MM/DD/YYYY')
    });
    
    callback();
  });
}

function savePosts() {
  posts.forEach(function(item) {
    Post.find({ title: item.title }, function(err, doc) {
      if (err) throw err;

      if (doc.length > 0) {
        console.log(`There is already the post: ${item.title}`);
        return;
      }

      let post = new Post({
        siteName: item.site_name,
        title: item.title,
        url: item.url,
        author: item.author,
        category: item.category,
        datePublished: item.date_published,
        dateFormated: item.date_formated
      });

      post.save((err) => {
        if (err) throw err;
        console.log('Posts saved');
        process.exit();
      });
    });

  });
}

parserFeeds();