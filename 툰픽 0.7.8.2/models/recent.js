const mongoose = require('mongoose');

const recentSchema = new mongoose.Schema({
  webtoonTitle: String,
  user: String,
  author: String,
  genre: String,
  thumbnail: String,
  link: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recent', recentSchema);
