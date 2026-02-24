import PostCard from './PostCard';

function PostList({ posts }) {
  if (!posts.length) {
    return <p>No published posts found.</p>;
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
