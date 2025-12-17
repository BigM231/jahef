import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Edit, Trash2, Eye, ArrowUpDown, FileText, RotateCcw } from 'lucide-react';
import { useAllPosts, useDeletePost, BlogPostStatus, getCategoryLabel, getCategoryColor, BlogPost } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface BlogPostsListProps {
  onEdit: (id: string) => void;
  onCreateNew: () => void;
  showTrash?: boolean;
}

export default function BlogPostsList({ onEdit, onCreateNew, showTrash = false }: BlogPostsListProps) {
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const { data: posts, isLoading } = useAllPosts(statusFilter, searchQuery);
  const deletePost = useDeletePost();
  const queryClient = useQueryClient();

  // Filter posts based on trash view
  const filteredPosts = posts?.filter(post => {
    if (showTrash) {
      return post.deleted_at !== null || post.status === 'trash';
    }
    return post.deleted_at === null && post.status !== 'trash';
  });

  const handleDelete = async () => {
    if (deletePostId) {
      await deletePost.mutateAsync(deletePostId);
      setDeletePostId(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedPosts) {
        await supabase
          .from('blog_posts')
          .update({ 
            status: 'trash' as BlogPostStatus,
            deleted_at: new Date().toISOString() 
          })
          .eq('id', id);
      }
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success(`${selectedPosts.length} posts moved to trash`);
      setSelectedPosts([]);
      setShowBulkDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete posts');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await supabase
        .from('blog_posts')
        .update({ 
          status: 'draft' as BlogPostStatus,
          deleted_at: null 
        })
        .eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post restored successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore post');
    }
  };

  const handleBulkRestore = async () => {
    try {
      for (const id of selectedPosts) {
        await supabase
          .from('blog_posts')
          .update({ 
            status: 'draft' as BlogPostStatus,
            deleted_at: null 
          })
          .eq('id', id);
      }
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success(`${selectedPosts.length} posts restored`);
      setSelectedPosts([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to restore posts');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post permanently deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const toggleSelectPost = (id: string) => {
    setSelectedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts?.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts?.map(p => p.id) || []);
    }
  };

  const sortedPosts = filteredPosts?.slice().sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const getStatusBadge = (status: BlogPostStatus) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Scheduled</Badge>;
      case 'trash':
        return <Badge variant="destructive">Trash</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {!showTrash && (
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedPosts.length} selected
            </span>
            {showTrash ? (
              <Button variant="outline" size="sm" onClick={handleBulkRestore}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore Selected
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowBulkDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading posts...</div>
        ) : sortedPosts?.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {showTrash ? 'No posts in trash' : 'No blog posts found'}
            </p>
            {!showTrash && <Button onClick={onCreateNew}>Create Your First Post</Button>}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedPosts.length === sortedPosts?.length && sortedPosts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPosts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => toggleSelectPost(post.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>{post.author_name}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(post.category)}>
                      {getCategoryLabel(post.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.publication_date
                      ? format(new Date(post.publication_date), 'MMM d, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {showTrash ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestore(post.id)}
                            title="Restore"
                            className="text-green-600 hover:text-green-700"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletePostId(post.id)}
                            title="Delete Permanently"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(post.id)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletePostId(post.id)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {showTrash 
                ? 'This post will be permanently deleted. This action cannot be undone.'
                : 'This post will be moved to trash. You can recover it within 30 days.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showTrash ? handlePermanentDelete(deletePostId!) : handleDelete()} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedPosts.length} posts?</AlertDialogTitle>
            <AlertDialogDescription>
              These posts will be moved to trash. You can recover them within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
