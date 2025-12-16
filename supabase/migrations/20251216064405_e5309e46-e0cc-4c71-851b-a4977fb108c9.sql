-- Create enum for blog post status
CREATE TYPE public.blog_post_status AS ENUM ('draft', 'published', 'scheduled', 'trash');

-- Create enum for blog categories
CREATE TYPE public.blog_category AS ENUM ('success_stories', 'program_updates', 'emergency_appeals', 'community_news', 'case_studies');

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured_image_url TEXT,
  featured_image_path TEXT,
  category blog_category NOT NULL DEFAULT 'community_news',
  content TEXT NOT NULL,
  excerpt TEXT,
  author_name TEXT NOT NULL,
  status blog_post_status NOT NULL DEFAULT 'draft',
  publication_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  audio_url TEXT,
  audio_path TEXT,
  additional_images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  meta_description TEXT,
  is_series BOOLEAN DEFAULT false,
  series_name TEXT,
  series_part INTEGER,
  previous_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  next_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_publication_date ON public.blog_posts(publication_date DESC);
CREATE INDEX idx_blog_posts_series_name ON public.blog_posts(series_name) WHERE series_name IS NOT NULL;

-- RLS Policies
-- Anyone can view published posts
CREATE POLICY "Anyone can view published posts"
ON public.blog_posts
FOR SELECT
USING (status = 'published' AND (deleted_at IS NULL));

-- Authenticated users can view all posts (for admin)
CREATE POLICY "Authenticated users can view all posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their posts
CREATE POLICY "Authenticated users can update posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Authenticated users can delete their posts
CREATE POLICY "Authenticated users can delete posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for blog
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-audio', 'blog-audio', true);

-- Storage policies for blog images
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Users can update their blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Users can delete their blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Storage policies for blog audio
CREATE POLICY "Blog audio is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-audio');

CREATE POLICY "Authenticated users can upload blog audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-audio');

CREATE POLICY "Users can update their blog audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-audio');

CREATE POLICY "Users can delete their blog audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-audio');