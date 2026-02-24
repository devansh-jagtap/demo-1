const express = require('express');
const {
  addComment,
  getCommentsForPost,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/post/:postId', getCommentsForPost);
router.post('/post/:postId', protect, addComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
