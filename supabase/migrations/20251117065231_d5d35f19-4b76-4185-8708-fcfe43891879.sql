-- Create gallery_media table to store media metadata
CREATE TABLE public.gallery_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery_media ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery_media
CREATE POLICY "Anyone can view gallery media" 
ON public.gallery_media 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create gallery media" 
ON public.gallery_media 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gallery media" 
ON public.gallery_media 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gallery media" 
ON public.gallery_media 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gallery_media_updated_at
BEFORE UPDATE ON public.gallery_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for gallery media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-videos', 'gallery-videos', true);

-- Create storage policies for gallery-images bucket
CREATE POLICY "Anyone can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for gallery-videos bucket
CREATE POLICY "Anyone can view gallery videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery-videos');

CREATE POLICY "Authenticated users can upload gallery videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery-videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own gallery videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own gallery videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create index for faster queries
CREATE INDEX idx_gallery_media_category ON public.gallery_media(category);
CREATE INDEX idx_gallery_media_media_type ON public.gallery_media(media_type);
CREATE INDEX idx_gallery_media_created_at ON public.gallery_media(created_at DESC);