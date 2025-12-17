import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
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
import { Search, Edit, Trash2, Eye, ArrowUpDown, FileText, RotateCcw, Calendar, User } from 'lucide-react';
import { useAllPosts, useDeletePost, BlogPostStatus, getCategoryLabel, getCategoryColor } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface BlogPostsListProps {
  onEdit: (id: string) => void;
  onCreateNew: () => void;
  filterStatus: 'all' | 'published' | 'draft' | 'scheduled' | 'trash';
}

export default function BlogPostsList({ onEdit, onCreateNew, filterStatus }: BlogPostsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const { data: posts, isLoading } = useAllPosts('all', searchQuery);
  const deletePost = useDeletePost();
  const queryClient = useQueryClient();

  const isTrashView = filterStatus === 'trash';
  const isPublishedView = filterStatus === 'published';

  const filteredPosts = posts?.filter(post => {
    if (filterStatus === 'trash') return post.deleted_at !== null || post.status === 'trash';
    if (filterStatus === 'all') return post.deleted_at === null && post.status !== 'trash';
    return post.deleted_at === null && post.status === filterStatus;
  });

  const handleDelete = async () => {
    if (deletePostId) {
      if (isTrashView) await supabase.from('blog_posts').delete().eq('id', deletePostId);
      else await deletePost.mutateAsync(deletePostId);
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setDeletePostId(null);
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedPosts) {
      await supabase.from('blog_posts').update({ status: 'trash' as BlogPostStatus, deleted_at: new Date().toISOString() }).eq('id', id);
    }
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    toast.success(`${selectedPosts.length} posts moved to trash`);
    setSelectedPosts([]);
    setShowBulkDeleteDialog(false);
  };

  const handleRestore = async (id: string) => {
    await supabase.from('blog_posts').update({ status: 'draft' as BlogPostStatus, deleted_at: null }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    toast.success('Post restored');
  };

  const handleBulkRestore = async () => {
    for (const id of selectedPosts) {
      await supabase.from('blog_posts').update({ status: 'draft' as BlogPostStatus, deleted_at: null }).eq('id', id);
    }
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    toast.success(`${selectedPosts.length} posts restored`);
    setSelectedPosts([]);
  };

  const toggleSelectPost = (id: string) => setSelectedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedPosts(selectedPosts.length === filteredPosts?.length ? [] : filteredPosts?.map(p => p.id) || []);

  const sortedPosts = filteredPosts?.slice().sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const getStatusBadge = (status: BlogPostStatus) => {
    const badges: Record<string, JSX.Element> = {
      published: <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>,
      draft: <Badge variant="secondary">Draft</Badge>,
      scheduled: <Badge className="bg-yellow-500 hover:bg-yellow-600">Scheduled</Badge>,
      trash: <Badge variant="destructive">Trash</Badge>,
    };
    return badges[status] || <Badge variant="outline">{status}</Badge>;
  };

  const getEmptyMessage = () => ({
    published: 'No published posts yet.',
    draft: 'No draft posts',
    scheduled: 'No scheduled posts',
    trash: 'Trash is empty',
    all: 'No blog posts found',
  }[filterStatus]);

  // Published View - Card Layout like /news
  if (isPublishedView) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}>
              <ArrowUpDown className="h-4 w-4 mr-2" />{sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </Button>
          </div>
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedPosts.length} selected</span>
              <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteDialog(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
            </div>
          )}
        </div>

        {isLoading ? <div className="p-8 text-center text-muted-foreground">Loading...</div> : sortedPosts?.length === 0 ? (
          <div className="p-8 text-center"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">{getEmptyMessage()}</p><Button onClick={onCreateNew}>Create Post</Button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts?.map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-none shadow-lg rounded-2xl relative">
                <div className="absolute top-4 right-4 z-10"><Checkbox checked={selectedPosts.includes(post.id)} onCheckedChange={() => toggleSelectPost(post.id)} className="bg-white/80 border-2" /></div>
                <div className="relative h-48 overflow-hidden">
                  {post.featured_image_url ? <img src={post.featured_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <div className="w-full h-full bg-muted flex items-center justify-center"><FileText className="h-12 w-12 text-muted-foreground" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                  <div className="absolute top-4 left-4"><Badge className={`${getCategoryColor(post.category)} text-white`}>{getCategoryLabel(post.category)}</Badge></div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} />{post.publication_date ? format(new Date(post.publication_date), 'MMM d, yyyy') : '-'}</span>
                    <span className="flex items-center gap-1"><User size={14} />{post.author_name}</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150)}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><Eye size={14} />{post.view_count || 0} views</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}><Eye className="h-4 w-4 mr-2" />View</Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(post.id)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeletePostId(post.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete post?</AlertDialogTitle><AlertDialogDescription>This post will be moved to trash and removed from /news.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {selectedPosts.length} posts?</AlertDialogTitle><AlertDialogDescription>These posts will be moved to trash.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">Delete All</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </div>
    );
  }

  // Table View for other tabs
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
          <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}><ArrowUpDown className="h-4 w-4 mr-2" />{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</Button>
        </div>
        {selectedPosts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedPosts.length} selected</span>
            {isTrashView ? <Button variant="outline" size="sm" onClick={handleBulkRestore}><RotateCcw className="h-4 w-4 mr-2" />Restore</Button> : <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteDialog(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>}
          </div>
        )}
      </div>
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {isLoading ? <div className="p-8 text-center text-muted-foreground">Loading...</div> : sortedPosts?.length === 0 ? (
          <div className="p-8 text-center"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">{getEmptyMessage()}</p>{filterStatus !== 'trash' && <Button onClick={onCreateNew}>Create Post</Button>}</div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead className="w-[50px]"><Checkbox checked={selectedPosts.length === sortedPosts?.length && sortedPosts.length > 0} onCheckedChange={toggleSelectAll} /></TableHead><TableHead className="w-[80px]">Image</TableHead><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Category</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {sortedPosts?.map((post) => (
                <TableRow key={post.id}>
                  <TableCell><Checkbox checked={selectedPosts.includes(post.id)} onCheckedChange={() => toggleSelectPost(post.id)} /></TableCell>
                  <TableCell>{post.featured_image_url ? <img src={post.featured_image_url} alt={post.title} className="w-16 h-12 object-cover rounded" /> : <div className="w-16 h-12 bg-muted rounded flex items-center justify-center"><FileText className="h-5 w-5 text-muted-foreground" /></div>}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                  <TableCell>{post.author_name}</TableCell>
                  <TableCell><Badge className={getCategoryColor(post.category)}>{getCategoryLabel(post.category)}</Badge></TableCell>
                  <TableCell>{post.publication_date ? format(new Date(post.publication_date), 'MMM d, yyyy') : '-'}</TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {isTrashView ? (<><Button variant="ghost" size="icon" onClick={() => handleRestore(post.id)} className="text-green-600"><RotateCcw className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setDeletePostId(post.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button></>) : (<><Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => onEdit(post.id)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setDeletePostId(post.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button></>)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>{isTrashView ? 'This will permanently delete the post.' : 'This post will be moved to trash.'}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete {selectedPosts.length} posts?</AlertDialogTitle><AlertDialogDescription>These posts will be moved to trash.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">Delete All</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
