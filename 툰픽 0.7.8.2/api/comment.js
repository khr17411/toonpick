//api/comments
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

// 좋아요
router.patch('/:id/like', async (req, res) => {
  const { cancel } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('댓글 없음');

    if (cancel) {
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
    } else {
      comment.likes = (comment.likes || 0) + 1;
    }

    await comment.save();
    res.status(200).json({ message: cancel ? '좋아요 -1 완료' : '좋아요 +1 완료' });
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

// 싫어요
router.patch('/:id/dislike', async (req, res) => {
  const { cancel } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('댓글 없음');

    if (cancel) {
      comment.dislikes = Math.max(0, (comment.dislikes || 0) - 1);
    } else {
      comment.dislikes = (comment.dislikes || 0) + 1;
    }

    await comment.save();
    res.status(200).json({ message: cancel ? '싫어요 -1 완료' : '싫어요 +1 완료' });
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

module.exports = router;
