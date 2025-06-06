const express = require('express');
const router = express.Router();
const Recent = require('../models/recent');

router.post('/', async (req, res) => {
  const { user, webtoonTitle, author, genre, thumbnail, link } = req.body;

  try {
    await Recent.deleteOne({ user, webtoonTitle });
    await Recent.create({ user, webtoonTitle, author, genre, thumbnail, link });
    const count = await Recent.countDocuments({ user });
    if (count > 30) {
      const oldest = await Recent.find({ user }).sort({ timestamp: 1 }).limit(count - 30);
      const idsToDelete = oldest.map(doc => doc._id);
      await Recent.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).send('최근 본 웹툰 저장 완료');
  } catch (err) {
    console.error('❌ 저장 실패:', err);
    res.status(500).send('서버 에러');
  }
});


router.get('/user/:username', async (req, res) => {
  try {
    const data = await Recent.find({ user: req.params.username }).sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    console.error('❌ 최근 웹툰 불러오기 실패:', err);
    res.status(500).send('서버 에러');
  }
});

module.exports = router;
