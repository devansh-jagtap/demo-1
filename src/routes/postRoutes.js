const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);
router.post('/', protect, authorize('writer', 'admin'), createPost);
router.put('/:id', protect, authorize('writer', 'admin'), updatePost);
router.delete('/:id', protect, authorize('writer', 'admin'), deletePost);

module.exports = router;
