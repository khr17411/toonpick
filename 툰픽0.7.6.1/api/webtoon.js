// api/webtoon.js
const express = require('express');
const router = express.Router();
const Webtoon = require('../models/webtoon');

// 전체 목록
router.get('/', async (req, res) => {
  try {
    const webtoons = await Webtoon.find({});
    res.json(webtoons);
  } catch (err) {
    res.status(500).send('웹툰 목록 조회 실패');
  }
});

// 제목 검색
router.get('/search', async (req, res) => {
  const { title } = req.query;
  try {
    const webtoons = await Webtoon.find({ title: new RegExp(title, 'i') });
    res.json(webtoons);
  } catch (err) {
    res.status(500).send('검색 실패');
  }
});

// 장르 필터
router.get('/genre/:genre', async (req, res) => {
  try {
    const webtoons = await Webtoon.find({ genres: req.params.genre });
    res.json(webtoons);
  } catch (err) {
    res.status(500).send('장르 필터 실패');
  }
});

// 단일 상세
router.get('/:id', async (req, res) => {
  try {
    const webtoon = await Webtoon.findById(req.params.id);
    if (!webtoon) return res.status(404).send('웹툰 없음');
    res.json(webtoon);
  } catch (err) {
    res.status(500).send('상세 조회 실패');
  }
});

module.exports = router;
