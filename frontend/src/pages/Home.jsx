import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import PostList from '../components/PostList';
import { Card, CardContent } from "@/components/ui/card";

const FALLBACK_POSTS = [
  {
    _id: 'demo-1',
    title: 'Welcome to Integra Magna',
    content:
      'This is your new blogging space. Once you start creating posts, they will appear here. For now, enjoy this demo article and explore the UI.',
    tags: ['getting started', 'welcome'],
    author: { name: 'Demo Author' },
  },
  {
    _id: 'demo-2',
    title: 'Writing your first blog post',
    content:
      'Use the writer role to create rich articles, add tags, and share your ideas. The backend API already supports authenticated writers.',
    tags: ['writers', 'tips'],
    author: { name: 'Product Team' },
  },
  {
    _id: 'demo-3',
    title: 'Readers, comments, and feedback',
    content:
      'Readers can browse published posts and engage with comments. This card is just sample content so your homepage never looks empty.',
    tags: ['community'],
    author: { name: 'Community' },
  },
];

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        const response = await api.get('/posts', {
          params: { page: 1, limit: 10 },
        });
        if (!cancelled) {
          setPosts(response.data.posts || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Failed to load posts');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    if (posts && posts.length) return posts;
    return FALLBACK_POSTS;
  }, [posts]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <section className="grid md:grid-cols-[2.2fr_1.2fr] gap-8 mb-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
            Your stories, beautifully presented.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Integra Magna is a simple blog platform where writers share ideas and readers discover fresh
            perspectives. Sign up as a writer to start publishing, or browse the latest posts below.
          </p>
        </div>
        <div className="grid gap-4">
          <Card className="bg-slate-900 text-slate-50 border-slate-800">
            <CardContent className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Total posts</span>
              <span className="text-3xl font-bold">{visiblePosts.length}</span>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 text-slate-50 border-slate-800">
            <CardContent className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Roles Available</span>
              <span className="text-xl font-medium">Reader · Writer · Admin</span>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid lg:grid-cols-[2.3fr_1.2fr] gap-10 items-start">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b">
            <h3 className="text-2xl font-bold">Latest posts</h3>
            {loading && <p className="text-sm text-slate-500">Loading posts...</p>}
            {error && !loading && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Demo Mode</span>}
          </div>
          {!loading && <PostList posts={visiblePosts} />}
        </div>

        <aside className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg mb-3">How to get started</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm">
                <li>Sign up with your email.</li>
                <li>Log in as a writer.</li>
                <li>Create and publish your first blog post.</li>
                <li>Read and comment on other posts.</li>
              </ol>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm bg-slate-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-lg mb-3">Tips for better posts</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                <li>Use clear titles and relevant tags.</li>
                <li>Keep paragraphs short and readable.</li>
                <li>Engage with comments from your readers.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}

export default Home;
