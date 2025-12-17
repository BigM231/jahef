import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Music, ArrowLeft } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import {
  useCreatePost,
  useUpdatePost,
  usePostById,
  useAllPosts,
  BlogCategory,
  BlogPostStatus,
  generateSlug,
} from '@/hooks/useBlogPosts';

const CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: 'success_stories', label: 'Success Stories' },
  { value: 'program_updates', label: 'Program Updates' },
  { value: 'emergency_appeals', label: 'Emergency Appeals' },
  { value: 'community_news', label: 'Community News' },
  { value: 'case_studies', label: 'Case Studies' },
];

interface BlogPostFormProps {
  editId?: string | null;
  onBack: () => void;
  user: any;
}

export default function BlogPostForm({ editId, onBack, user }: BlogPostFormProps) {
  const isEditing = !!editId;
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogCategory>('community_news');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publicationDate, setPublicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [scheduledDate, setScheduledDate] = useState('');
  const [tags, setTags] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<BlogPostStatus>('draft');

  // Series state
  const [isSeries, setIsSeries] = useState(false);
  const [seriesName, setSeriesName] = useState('');
  const [seriesPart, setSeriesPart] = useState<number>(1);
  const [previousPostId, setPreviousPostId] = useState('');

  // File state
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>([]);

  const { data: existingPost } = usePostById(editId || '');
  const { data: allPosts } = useAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  useEffect(() => {
    if (user) {
      setAuthorName(user.email?.split('@')[0] || 'Admin');
    }
  }, [user]);

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setCategory(existingPost.category);
      setContent(existingPost.content);
      setAuthorName(existingPost.author_name);
      if (existingPost.publication_date) {
        setPublicationDate(existingPost.publication_date.split('T')[0]);
      }
      if (existingPost.scheduled_date) {
        setScheduledDate(existingPost.scheduled_date.split('T')[0]);
      }
      setTags(existingPost.tags?.join(', ') || '');
      setMetaDescription(existingPost.meta_description || '');
      setStatus(existingPost.status);
      setIsSeries(existingPost.is_series || false);
      setSeriesName(existingPost.series_name || '');
      setSeriesPart(existingPost.series_part || 1);
      setPreviousPostId(existingPost.previous_post_id || '');
      setFeaturedImageUrl(existingPost.featured_image_url || '');
      setAudioUrl(existingPost.audio_url || '');
      setAdditionalImageUrls(existingPost.additional_images || []);
    }
  }, [existingPost]);

  // Reset form when switching from edit to create
  useEffect(() => {
    if (!editId) {
      setTitle('');
      setSlug('');
      setCategory('community_news');
      setContent('');
      setAuthorName(user?.email?.split('@')[0] || 'Admin');
      setPublicationDate(new Date().toISOString().split('T')[0]);
      setScheduledDate('');
      setTags('');
      setMetaDescription('');
      setStatus('draft');
      setIsSeries(false);
      setSeriesName('');
      setSeriesPart(1);
      setPreviousPostId('');
      setFeaturedImage(null);
      setFeaturedImageUrl('');
      setAudioFile(null);
      setAudioUrl('');
      setAdditionalImages([]);
      setAdditionalImageUrls([]);
    }
  }, [editId, user]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isEditing]);

  const uploadFile = async (file: File, bucket: string): Promise<{ url: string; path: string }> => {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  };

  const handleSubmit = async (submitStatus: BlogPostStatus) => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please enter content');
      return;
    }
    if (!featuredImageUrl && !featuredImage) {
      toast.error('Please upload a featured image');
      return;
    }

    setIsLoading(true);

    try {
      let finalFeaturedImageUrl = featuredImageUrl;
      let finalFeaturedImagePath = existingPost?.featured_image_path || '';
      let finalAudioUrl = audioUrl;
      let finalAudioPath = existingPost?.audio_path || '';
      let finalAdditionalImages = additionalImageUrls;

      // Upload featured image if new
      if (featuredImage) {
        const result = await uploadFile(featuredImage, 'blog-images');
        finalFeaturedImageUrl = result.url;
        finalFeaturedImagePath = result.path;
      }

      // Upload audio if new
      if (audioFile) {
        const result = await uploadFile(audioFile, 'blog-audio');
        finalAudioUrl = result.url;
        finalAudioPath = result.path;
      }

      // Upload additional images
      if (additionalImages.length > 0) {
        const uploadedUrls = await Promise.all(
          additionalImages.map(async (img) => {
            const result = await uploadFile(img, 'blog-images');
            return result.url;
          })
        );
        finalAdditionalImages = [...finalAdditionalImages, ...uploadedUrls];
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        content,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        author_name: authorName,
        status: submitStatus,
        publication_date: submitStatus === 'published' ? new Date().toISOString() : publicationDate,
        scheduled_date: submitStatus === 'scheduled' ? scheduledDate : null,
        featured_image_url: finalFeaturedImageUrl,
        featured_image_path: finalFeaturedImagePath,
        audio_url: finalAudioUrl || null,
        audio_path: finalAudioPath || null,
        additional_images: finalAdditionalImages,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        meta_description: metaDescription || null,
        is_series: isSeries,
        series_name: isSeries ? seriesName : null,
        series_part: isSeries ? seriesPart : null,
        previous_post_id: isSeries && previousPostId ? previousPostId : null,
      };

      if (isEditing && editId) {
        await updatePost.mutateAsync({ id: editId, ...postData });
      } else {
        await createPost.mutateAsync(postData);
      }

      onBack();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.error('Please select a JPG or PNG image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setFeaturedImage(file);
      setFeaturedImageUrl(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^audio\/(mpeg|wav|mp3)$/)) {
        toast.error('Please select an MP3 or WAV file');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Audio must be less than 20MB');
        return;
      }
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = additionalImageUrls.length + additionalImages.length;

    if (currentCount + files.length > 5) {
      toast.error('Maximum 5 additional images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.error(`${file.name} is not a valid image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large`);
        return false;
      }
      return true;
    });

    setAdditionalImages([...additionalImages, ...validFiles]);
  };

  const removeAdditionalImage = (index: number, isUrl: boolean) => {
    if (isUrl) {
      setAdditionalImageUrls(additionalImageUrls.filter((_, i) => i !== index));
    } else {
      setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold text-foreground">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isLoading}
          >
            Save as Draft
          </Button>
          {status !== 'published' && (
            <Button
              variant="outline"
              onClick={() => handleSubmit('scheduled')}
              disabled={isLoading || !scheduledDate}
            >
              Schedule
            </Button>
          )}
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? 'Saving...' : 'Publish Now'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value.substring(0, 200))}
              placeholder="Enter your blog post title"
              className="text-lg"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-muted-foreground">
              Preview: /blog/{slug || 'your-post-slug'}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Blog Content *</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="meta">Meta Description (SEO)</Label>
            <Textarea
              id="meta"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value.substring(0, 160))}
              placeholder="Brief description for search engines..."
              rows={2}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Featured Image *
              </CardTitle>
            </CardHeader>
            <CardContent>
              {featuredImageUrl ? (
                <div className="relative">
                  <img
                    src={featuredImageUrl}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setFeaturedImage(null);
                      setFeaturedImageUrl('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG (max 5MB)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFeaturedImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Category & Author */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as BlogCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pubDate">Publication Date</Label>
                <Input
                  id="pubDate"
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedDate">Schedule Date (optional)</Label>
                <Input
                  id="schedDate"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="education, lagos, help needed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Music className="h-4 w-4" />
                Audio File (optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {audioUrl ? (
                <div className="space-y-2">
                  <audio src={audioUrl} controls className="w-full" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAudioFile(null);
                      setAudioUrl('');
                    }}
                  >
                    Remove Audio
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">MP3, WAV (max 20MB)</span>
                  <input
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp3"
                    onChange={handleAudioChange}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Additional Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Images (max 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {additionalImageUrls.map((url, i) => (
                  <div key={`url-${i}`} className="relative">
                    <img src={url} alt="" className="w-full h-16 object-cover rounded" />
                    <button
                      onClick={() => removeAdditionalImage(i, true)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {additionalImages.map((file, i) => (
                  <div key={`file-${i}`} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-16 object-cover rounded"
                    />
                    <button
                      onClick={() => removeAdditionalImage(i, false)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              {additionalImageUrls.length + additionalImages.length < 5 && (
                <label className="flex items-center justify-center h-16 border-2 border-dashed rounded cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleAdditionalImagesChange}
                    multiple
                    className="hidden"
                  />
                  <span className="text-xs text-muted-foreground">+ Add images</span>
                </label>
              )}
            </CardContent>
          </Card>

          {/* Series */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Series Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isSeries"
                  checked={isSeries}
                  onCheckedChange={(checked) => setIsSeries(!!checked)}
                />
                <Label htmlFor="isSeries">This is part of a series</Label>
              </div>

              {isSeries && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="seriesName">Series Name</Label>
                    <Input
                      id="seriesName"
                      value={seriesName}
                      onChange={(e) => setSeriesName(e.target.value)}
                      placeholder="e.g., Hannah's Story"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seriesPart">Part Number</Label>
                    <Input
                      id="seriesPart"
                      type="number"
                      min={1}
                      value={seriesPart}
                      onChange={(e) => setSeriesPart(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link to Previous Post</Label>
                    <Select value={previousPostId} onValueChange={setPreviousPostId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select previous post" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {allPosts
                          ?.filter((p) => p.id !== editId)
                          .map((post) => (
                            <SelectItem key={post.id} value={post.id}>
                              {post.title}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
