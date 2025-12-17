-- Create an enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable Row Level Security on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if a user has a role
-- This avoids infinite recursion issues with RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create a convenience function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS policy for user_roles: Only admins can view roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policy: Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing blog_posts policies for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.blog_posts;

-- Create new admin-only policies for blog_posts
CREATE POLICY "Admins can view all posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can create posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin() AND auth.uid() = user_id);

CREATE POLICY "Admins can update posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Drop existing gallery_media policy for authenticated users creating media
DROP POLICY IF EXISTS "Authenticated users can create gallery media" ON public.gallery_media;

-- Create new admin-only policy for gallery_media creation
CREATE POLICY "Admins can create gallery media"
ON public.gallery_media
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin() AND auth.uid() = user_id);