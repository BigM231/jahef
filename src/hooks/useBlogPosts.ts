import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type BlogPostStatus = 'draft' | 'published' | 'scheduled' | 'trash';
export type BlogCategory = 'success_stories' | 'program_updates' | 'emergency_appeals' | 'community_news' | 'case_studies';

export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  featured_image_url: string | null;
  featured_image_path: string | null;
  category: BlogCategory;
  content: string;
  excerpt: string | null;
  author_name: string;
  status: BlogPostStatus;
  publication_date: string | null;
  scheduled_date: string | null;
  audio_url: string | null;
  audio_path: string | null;
  additional_images: string[];
  tags: string[];
  meta_description: string | null;
  is_series: boolean;
  series_name: string | null;
  series_part: number | null;
  previous_post_id: string | null;
  next_post_id: string | null;
  view_count: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  featured_image_url?: string | null;
  featured_image_path?: string | null;
  category: BlogCategory;
  content: string;
  excerpt?: string | null;
  author_name: string;
  status: BlogPostStatus;
  publication_date?: string | null;
  scheduled_date?: string | null;
  audio_url?: string | null;
  audio_path?: string | null;
  additional_images?: string[];
  tags?: string[];
  meta_description?: string | null;
  is_series?: boolean;
  series_name?: string | null;
  series_part?: number | null;
  previous_post_id?: string | null;
}

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  success_stories: 'Success Stories',
  program_updates: 'Program Updates',
  emergency_appeals: 'Emergency Appeals',
  community_news: 'Community News',
  case_studies: 'Case Studies',
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  success_stories: 'bg-green-500',
  program_updates: 'bg-blue-500',
  emergency_appeals: 'bg-red-500',
  community_news: 'bg-purple-500',
  case_studies: 'bg-orange-500',
};

export const getCategoryLabel = (category: BlogCategory) => CATEGORY_LABELS[category];
export const getCategoryColor = (category: BlogCategory) => CATEGORY_COLORS[category];

export function usePublishedPosts(category?: BlogCategory, searchQuery?: string) {
  return useQuery({
    queryKey: ['blog-posts', 'published', category, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('publication_date', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function useAllPosts(statusFilter?: BlogPostStatus | 'all', searchQuery?: string) {
  return useQuery({
    queryKey: ['blog-posts', 'all', statusFilter, searchQuery],
    queryFn: async () => {
      // Fetch all posts including trashed ones for the admin dashboard
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog-posts', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });
}

export function usePostById(id: string) {
  return useQuery({
    queryKey: ['blog-posts', 'id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!id,
  });
}

export function useSeriesPosts(seriesName: string, currentPostId?: string) {
  return useQuery({
    queryKey: ['blog-posts', 'series', seriesName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('series_name', seriesName)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('series_part', { ascending: true });

      if (error) throw error;
      return (data as BlogPost[]).filter(p => p.id !== currentPostId);
    },
    enabled: !!seriesName,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBlogPostInput) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...input,
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create blog post');
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateBlogPostInput> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog post');
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Soft delete - move to trash
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'trash' as BlogPostStatus,
          deleted_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Blog post moved to trash');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog post');
    },
  });
}

export function useIncrementViewCount() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: post } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('id', id)
        .single();
      
      if (post) {
        await supabase
          .from('blog_posts')
          .update({ view_count: (post.view_count || 0) + 1 })
          .eq('id', id);
      }
    },
  });
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}
