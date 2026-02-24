const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getPosts);
router.get('/:id', optionalProtect, getPostById);
router.post('/', protect, allowRoles('writer', 'admin'), createPost);
router.put('/:id', protect, allowRoles('writer', 'admin'), updatePost);
router.delete('/:id', protect, allowRoles('writer', 'admin'), deletePost);

module.exports = router;
