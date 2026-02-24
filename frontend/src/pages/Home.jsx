import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostList from '../components/PostList';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get('/posts', {
          params: { page: 1, limit: 10 },
        });
        setPosts(response.data.posts || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main className="container">
      <h2>Published Blogs</h2>
      {loading && <p>Loading posts...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && <PostList posts={posts} />}
    </main>
  );
}

export default Home;
