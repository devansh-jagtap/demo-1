import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [status, setStatus] = useState('published');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    async function onSubmit(event) {
        event.preventDefault();
        setMessage('');

        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
            await api.post('/posts', {
                title,
                content,
                tags: tagsArray,
                status,
            });
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create post');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
            <Card className="w-full max-w-2xl shadow-lg border border-gray-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create a New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="My awesome post title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Write your content here..."
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                required
                                className="min-h-[200px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                id="tags"
                                type="text"
                                placeholder="e.g. technology, news"
                                value={tags}
                                onChange={(event) => setTags(event.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        {message && <p className="text-sm font-medium text-red-500">{message}</p>}
                        <Button type="submit" className="mt-4">Publish Post</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default CreatePost;
