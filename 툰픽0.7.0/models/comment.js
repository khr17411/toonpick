<<<<<<< HEAD
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  webtoonTitle: String,
  user: String,
  content: String,
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
=======
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  webtoonTitle: String,
  user: String,
  content: String,
  likes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
>>>>>>> origin/main
