import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(!!localStorage.getItem('token'));
        fetchPostAndComments();
    }, [id]);

    async function fetchPostAndComments() {
        if (id.startsWith('demo-')) {
            const demoPosts = {
                'demo-1': {
                    _id: 'demo-1',
                    title: 'Welcome to Integra Magna',
                    content: 'This is your new blogging space. Once you start creating posts, they will appear here. For now, enjoy this demo article and explore the UI.',
                    tags: ['getting started', 'welcome'],
                    author: { name: 'Demo Author' },
                    status: 'published'
                },
                'demo-2': {
                    _id: 'demo-2',
                    title: 'Writing your first blog post',
                    content: 'Use the writer role to create rich articles, add tags, and share your ideas. The backend API already supports authenticated writers.',
                    tags: ['writers', 'tips'],
                    author: { name: 'Product Team' },
                    status: 'published'
                },
                'demo-3': {
                    _id: 'demo-3',
                    title: 'Readers, comments, and feedback',
                    content: 'Readers can browse published posts and engage with comments. This card is just sample content so your homepage never looks empty.',
                    tags: ['community'],
                    author: { name: 'Community' },
                    status: 'published'
                }
            };
            setPost(demoPosts[id]);
            setComments([]);
            setLoading(false);
            return;
        }

        try {
            const postRes = await api.get(`/posts/${id}`);
            setPost(postRes.data);
            if (postRes.data.status === 'published') {
                const commentsRes = await api.get(`/comments/post/${id}`);
                setComments(commentsRes.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load post');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.post(`/comments/post/${id}`, { content: newComment });
            setNewComment('');
            fetchPostAndComments();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add comment');
        }
    }

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!post) return <div className="text-center mt-10">Post not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold">{post.title}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                        By {post.author?.name || 'Unknown'} · {post.tags?.length ? post.tags.join(', ') : 'Untagged'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
                </CardContent>
            </Card>

            {post.status === 'published' && (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>

                    {isAuth ? (
                        <Card className="bg-slate-50 border-none shadow-sm">
                            <CardContent className="pt-6">
                                <form onSubmit={handleAddComment} className="space-y-3">
                                    <Textarea
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[100px] bg-white"
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit">Post Comment</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-muted-foreground bg-slate-50 p-4 rounded-md">
                            Please login to add a comment.
                        </div>
                    )}

                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <Card key={comment._id} className="shadow-sm">
                                <CardHeader className="py-3">
                                    <CardTitle className="text-base font-semibold">{comment.author?.name || 'Unknown User'}</CardTitle>
                                    <CardDescription className="text-xs">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="text-sm">{comment.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostDetails;
