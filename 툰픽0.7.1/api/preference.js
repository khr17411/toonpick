const express2 = require('express');
const router2 = express2.Router();
const Preference = require('../models/preference');

router2.post('/', async (req, res) => {
  const { user, webtoonTitle } = req.body;

  try {
    const existing = await Preference.findOne({ user, webtoonTitle });

    if (existing) {
      
      await Preference.deleteOne({ user, webtoonTitle });
      res.status(200).send('삭제됨');
    } else {
      
      await Preference.create({ user, webtoonTitle, timestamp: new Date() });
      res.status(200).send('추가됨');
    }
  } catch (err) {
    res.status(500).send('에러 발생');
  }
});
  module.exports = router2;