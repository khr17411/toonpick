// models/user_genre_score.js
const mongoose = require('mongoose');

const userGenreScoreSchema = new mongoose.Schema({
  user: String,
  scores: {
    type: Object,
    of: Number,
    default: {}
  }
});

module.exports = mongoose.model('UserGenreScore', userGenreScoreSchema);
