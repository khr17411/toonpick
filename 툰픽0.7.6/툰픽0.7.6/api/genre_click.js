const express = require('express');
const router = express.Router();
const updateGenreScore = require('../updateGenreScore');

router.post('/', async (req, res) => {
  const { user, webtoonTitle } = req.body;
  if (!user || !webtoonTitle) {
    return res.status(400).json({ error: 'Missing user or webtoonTitle' });
  }

  try {
    await updateGenreScore(user, webtoonTitle, 1);  
    res.status(200).json({ message: '기여도 1 증가 완료' });
  } catch (err) {
    console.error('기여도 증가 실패:', err);
    res.status(500).json({ error: '서버 에러' });
  }
});

module.exports = router;