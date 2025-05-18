<<<<<<< HEAD
const mongoose2 = require('mongoose');

const preferenceSchema = new mongoose2.Schema({
  webtoonTitle: String,
  user: String,
  timestamp: { type: Date, default: Date.now }
});

=======
const mongoose2 = require('mongoose');

const preferenceSchema = new mongoose2.Schema({
  webtoonTitle: String,
  user: String,
  timestamp: { type: Date, default: Date.now }
});

>>>>>>> origin/main
module.exports = mongoose2.model('Preference', preferenceSchema);