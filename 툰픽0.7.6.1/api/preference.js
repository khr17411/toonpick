const express2 = require('express');
const router2 = express2.Router();
const Preference = require('../models/preference');
const updateGenreScore = require('../updateGenreScore'); 

// 선호작 개수 및 현재 사용자 즐겨찾기 여부 반환
router2.get('/count', async (req, res) => {
  const { title } = req.query;
  const user = '익명';

  try {
    const count = await Preference.countDocuments({ webtoonTitle: title });
    const isFavorited = await Preference.exists({ webtoonTitle: title, user });
    res.json({ count, isFavorited: !!isFavorited });
  } catch (err) {
    res.status(500).send('조회 실패');
  }
});

// 즐겨찾기 토글
router2.post('/', async (req, res) => {
  const { user, webtoonTitle } = req.body;

  try {
    const existing = await Preference.findOne({ user, webtoonTitle });

    if (existing) {
      await Preference.deleteOne({ user, webtoonTitle });
      await updateGenreScore(user, webtoonTitle, -10); 
      res.status(200).send('삭제됨');
    } else {
      await Preference.create({ user, webtoonTitle, timestamp: new Date() });
      await updateGenreScore(user, webtoonTitle, +10); 
      res.status(200).send('추가됨');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('에러 발생');
  }
});

module.exports = router2;
