const Post = require('../models/Post');
const Comment = require('../models/Comment');

function buildPostVisibilityQuery(user) {
  if (!user) return { status: 'published' };
  if (user.role === 'admin') return {};
  if (user.role === 'writer') {
    return {
      $or: [{ status: 'published' }, { author: user._id }],
    };
  }
  return { status: 'published' };
}

async function createPost(req, res) {
  try {
    const { title, content, tags = [], status = 'draft' } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      tags,
      status,
      author: req.user._id,
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
}

async function getPosts(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    const visibilityQuery = buildPostVisibilityQuery(req.user);
    const query = { ...visibilityQuery };

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ title: regex }, { content: regex }, { tags: regex }],
      });
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email role');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = req.user;
    const canView =
      post.status === 'published' ||
      (user && (user.role === 'admin' || String(post.author._id) === String(user._id)));

    if (!canView) return res.status(403).json({ message: 'Forbidden' });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
}

async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = String(post.author) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    ['title', 'content', 'tags', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = String(post.author) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    return res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
}

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
