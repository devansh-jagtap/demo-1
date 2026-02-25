import PostCard from './PostCard';

function PostList({ posts }) {
  if (!posts.length) {
    return <p className="muted">No posts yet. Create your first one to see it here.</p>;
  }

  return (
    <section className="post-list">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
}

export default PostList;
