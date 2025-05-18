<<<<<<< HEAD
const mongoose = require('mongoose');

const webtoonSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  thumbnailUrl: String,
  url: String,
  genres: [String],
  weekday: String
});

module.exports = mongoose.model('Webtoon', webtoonSchema);
=======
const mongoose = require('mongoose');

const webtoonSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  thumbnailUrl: String,
  url: String,
  genres: [String],
  weekday: String
});

module.exports = mongoose.model('Webtoon', webtoonSchema);
>>>>>>> origin/main
