// updateGenreScore.js
const UserGenreScore = require('./models/user_genre_score');
const Webtoon = require('./models/webtoon');

async function updateGenreScore(user, webtoonTitle, delta) {
  console.log('[updateGenreScore] 받은 제목:', webtoonTitle);

  const webtoon = await Webtoon.findOne({
    title: new RegExp(`^${webtoonTitle.trim()}$`, 'i')
  });

  if (!webtoon) {
    console.warn('[updateGenreScore] ❌ 제목 일치 실패:', webtoonTitle);
    return;
  }

  const genres = Array.isArray(webtoon.genres) ? webtoon.genres : [];
  let userScore = await UserGenreScore.findOne({ user });

  if (!userScore) {
    userScore = new UserGenreScore({ user, scores: new Map() });
  }

  for (const genre of genres) {
    const current = userScore.scores.get(genre) || 0;
    userScore.scores.set(genre, current + delta);
  }

  await userScore.save();
  console.log(`[updateGenreScore]  ${user} → ${genres.join(', ')}에 기여도 ${delta} 반영됨`);
}

module.exports = updateGenreScore;
