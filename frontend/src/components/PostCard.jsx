function PostCard({ post }) {
  return (
    <article className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p className="meta">Tags: {post.tags?.join(', ') || 'none'}</p>
      <p className="meta">Author: {post.author?.name || 'unknown'}</p>
    </article>
  );
}

export default PostCard;
