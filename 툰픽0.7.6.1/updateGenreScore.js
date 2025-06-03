//updateGenreScore.js
const UserGenreScore = require('./models/user_genre_score');
const Webtoon = require('./models/webtoon');

async function updateGenreScore(user, webtoonTitle, delta) {
  const webtoon = await Webtoon.findOne({ title: webtoonTitle });
  if (!webtoon) return;

  const genres = Array.isArray(webtoon.genres) ? webtoon.genres : [];

  let userScore = await UserGenreScore.findOne({ user });
  if (!userScore) {
    userScore = new UserGenreScore({ user, scores: new Map() });
  }

  for (const genre of genres) {
    const current = userScore.scores.get(genre) || 0;
    userScore.scores[genre] = current + delta;
  }

  await userScore.save();
}

module.exports = updateGenreScore;
