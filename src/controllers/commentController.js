const Comment = require('../models/Comment');
const Post = require('../models/Post');

async function addComment(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'content is required' });

    const post = await Post.findById(req.params.postId);
    if (!post || post.status !== 'published') {
      return res.status(404).json({ message: 'Published post not found' });
    }

    const comment = await Comment.create({
      content,
      post: post._id,
      author: req.user._id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
}

async function getCommentsForPost(req, res) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post || post.status !== 'published') {
      return res.status(404).json({ message: 'Published post not found' });
    }

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = String(comment.author) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
}

module.exports = { addComment, getCommentsForPost, deleteComment };
