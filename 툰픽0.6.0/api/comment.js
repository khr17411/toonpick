<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

router.post('/', async (req, res) => {
  const { webtoonTitle, user, content } = req.body;
  try {
    const newComment = new Comment({ webtoonTitle, user, content });
    await newComment.save();
    res.status(200).send('댓글 저장 완료');
  } catch (err) {
    res.status(500).send('댓글 저장 실패');
  }
});

router.get('/', async (req, res) => {
    const { title } = req.query;
    try {
      const comments = await Comment.find({ webtoonTitle: title }).sort({ timestamp: -1 });
      res.json(comments);
    } catch (err) {
      res.status(500).send('댓글 조회 실패');
    }
  });

=======
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

router.post('/', async (req, res) => {
  const { webtoonTitle, user, content } = req.body;
  try {
    const newComment = new Comment({ webtoonTitle, user, content });
    await newComment.save();
    res.status(200).send('댓글 저장 완료');
  } catch (err) {
    res.status(500).send('댓글 저장 실패');
  }
});

router.get('/', async (req, res) => {
    const { title } = req.query;
    try {
      const comments = await Comment.find({ webtoonTitle: title }).sort({ timestamp: -1 });
      res.json(comments);
    } catch (err) {
      res.status(500).send('댓글 조회 실패');
    }
  });

>>>>>>> origin/main
  module.exports = router;