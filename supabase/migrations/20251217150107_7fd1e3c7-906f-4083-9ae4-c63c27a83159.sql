-- Add is_featured column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;