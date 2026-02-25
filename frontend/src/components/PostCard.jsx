import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function PostCard({ post }) {
  const preview =
    post.content && post.content.length > 220
      ? `${post.content.slice(0, 220)}…`
      : post.content || '';

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{post.title}</CardTitle>
        <CardDescription className="text-sm font-medium">
          {post.author?.name || 'Unknown author'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">{preview}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium">
          {post.tags?.length ? post.tags.join(', ') : 'Untagged'}
        </span>
        <Button asChild variant="outline" size="sm">
          <Link to={`/post/${post._id}`}>Read more & Comment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
