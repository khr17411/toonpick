const express = require('express');
const router = express.Router();
const Webtoon = require('../models/webtoon');
const UserGenreScore = require('../models/user_genre_score');

router.get('/', async (req, res) => {
  const user = req.query.user || '익명';

  try {
    const userData = await UserGenreScore.findOne({ user });
    if (!userData) return res.json({ top1: [], top2: [], top3: [] });

    let scoresObject;
    if (userData.scores instanceof Map) {
      scoresObject = Object.fromEntries(userData.scores);
    } else if (userData.scores.toObject) {
      scoresObject = userData.scores.toObject();
    } else {
      scoresObject = userData.scores;
    }

    const sortedGenres = Object.entries(scoresObject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    console.log('🎯 추천 대상 장르:', sortedGenres);

    const allWebtoons = await Webtoon.find();
    const result = { top1: [], top2: [], top3: [] };

    for (let i = 0; i < sortedGenres.length; i++) {
      const genre = sortedGenres[i];
      const count = [8, 8, 8][i];

      const matching = allWebtoons.filter(w =>
        Array.isArray(w.genres) && w.genres.includes(genre)
      );

      console.log(`장르: ${genre}, 후보 웹툰 수: ${matching.length}`);

      const shuffled = matching.sort(() => 0.5 - Math.random()).slice(0, count);

      result[`top${i + 1}`] = shuffled.map(w => ({
        title: w.title,
        author: w.author,
        thumbnail: w.thumbnailUrl,
        genres: w.genres,
        description: w.description,
        link: w.url
      }));
    }

    res.json({
    ...result,
    genres: sortedGenres
    });
  } catch (err) {
    console.error('추천 오류:', err);
    res.status(500).send('서버 오류');
  }
});

module.exports = router;
