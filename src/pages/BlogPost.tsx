import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { 
  usePostBySlug, 
  useSeriesPosts,
  useIncrementViewCount,
  getCategoryLabel, 
  getCategoryColor 
} from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import blogPlaceholder from '@/assets/blog-placeholder.jpg';

// Extract first image URL from HTML content
const extractFirstImageUrl = (content: string): string | null => {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : null;
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePostBySlug(slug || '');
  const { data: seriesPosts } = useSeriesPosts(
    post?.series_name || '', 
    post?.id
  );
  const incrementViewCount = useIncrementViewCount();

  // Increment view count on mount
  useEffect(() => {
    if (post?.id) {
      incrementViewCount.mutate(post.id);
    }
  }, [post?.id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post?.title || 'Check out this article from JAHEF';

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      '_blank'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Featured Image - with fallback logic */}
        {(() => {
          const inlineImageUrl = extractFirstImageUrl(post.content);
          const heroImageUrl = post.featured_image_url || inlineImageUrl || blogPlaceholder;
          return (
            <div className="w-full h-64 md:h-96 lg:h-[500px] relative">
              <img
                src={heroImageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          );
        })()}

        <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/news')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>

          {/* Series Badge */}
          {post.is_series && post.series_name && (
            <div className="mb-6">
              <Badge variant="outline" className="text-sm px-3 py-1">
                Part {post.series_part} of "{post.series_name}"
              </Badge>
            </div>
          )}

          {/* Category */}
          <Badge className={`${getCategoryColor(post.category)} text-white mb-4`}>
            {getCategoryLabel(post.category)}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-heading leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author_name}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.publication_date 
                ? format(new Date(post.publication_date), 'MMMM d, yyyy')
                : 'Draft'}
            </span>
          </div>

          <Separator className="mb-8" />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Audio Player */}
          {post.audio_url && (
            <div className="my-8">
              <h3 className="text-lg font-semibold mb-4">Listen to this story</h3>
              <AudioPlayer src={post.audio_url} title={post.title} />
            </div>
          )}

          {/* Additional Images Gallery */}
          {post.additional_images && post.additional_images.length > 0 && (
            <div className="my-8">
              <h3 className="text-lg font-semibold mb-4">Image Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.additional_images.map((url, index) => (
                  <a 
                    key={index} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-40 object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="my-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* Social Sharing */}
          <div className="flex items-center gap-4 mb-8">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Share2 className="h-4 w-4" />
              Share:
            </span>
            <Button variant="outline" size="icon" onClick={shareOnFacebook}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareOnTwitter}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareOnWhatsApp}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </Button>
          </div>

          {/* Series Navigation */}
          {post.is_series && seriesPosts && seriesPosts.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  More from "{post.series_name}"
                </h3>
                <div className="space-y-3">
                  {seriesPosts.map((seriesPost) => {
                    const seriesInlineImage = extractFirstImageUrl(seriesPost.content);
                    const seriesThumbnail = seriesPost.featured_image_url || seriesInlineImage || blogPlaceholder;
                    return (
                    <Link 
                      key={seriesPost.id}
                      to={`/blog/${seriesPost.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <img
                        src={seriesThumbnail}
                        alt={seriesPost.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs mb-1">
                          Part {seriesPost.series_part}
                        </Badge>
                        <p className="font-medium text-sm line-clamp-1">
                          {seriesPost.title}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Post Navigation */}
          <div className="flex justify-between items-center">
            {post.previous_post_id ? (
              <Button variant="outline" asChild>
                <Link to={`/blog/${post.previous_post_id}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Post
                </Link>
              </Button>
            ) : (
              <div />
            )}
            
            <Button variant="outline" asChild>
              <Link to="/news">
                View All Posts
              </Link>
            </Button>
            
            {post.next_post_id ? (
              <Button variant="outline" asChild>
                <Link to={`/blog/${post.next_post_id}`}>
                  Next Post
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
