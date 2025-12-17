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
import { Search, Edit, Trash2, Eye, ArrowUpDown, FileText, RotateCcw, Calendar, User, EyeOff, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useAllPosts, useDeletePost, BlogPostStatus, getCategoryLabel, getCategoryColor } from '@/hooks/useBlogPosts';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
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
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [hasInitializedExpanded, setHasInitializedExpanded] = useState(false);

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

  const handleUnpublish = async (id: string) => {
    await supabase.from('blog_posts').update({ status: 'draft' as BlogPostStatus }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    toast.success('Post unpublished - moved to drafts');
  };

  const handleBulkUnpublish = async () => {
    for (const id of selectedPosts) {
      await supabase.from('blog_posts').update({ status: 'draft' as BlogPostStatus }).eq('id', id);
    }
    queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    toast.success(`${selectedPosts.length} posts unpublished`);
    setSelectedPosts([]);
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

  const toggleExpandPost = (id: string) => setExpandedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const expandAll = () => setExpandedPosts(sortedPosts?.map(p => p.id) || []);
  const collapseAll = () => setExpandedPosts([]);

  // Ensure admins can read published posts here without needing to open the public /news page.
  useEffect(() => {
    if (!isPublishedView) return;
    if (hasInitializedExpanded) return;
    if (!sortedPosts || sortedPosts.length === 0) return;
    setExpandedPosts(sortedPosts.map(p => p.id));
    setHasInitializedExpanded(true);
  }, [isPublishedView, hasInitializedExpanded, sortedPosts]);

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

  // Published View - Full Article Layout like /news page
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
            <Button variant="outline" onClick={expandedPosts.length === sortedPosts?.length ? collapseAll : expandAll}>
              <ChevronsUpDown className="h-4 w-4 mr-2" />
              {expandedPosts.length === sortedPosts?.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedPosts.length} selected</span>
              <Button variant="secondary" size="sm" onClick={handleBulkUnpublish}><EyeOff className="h-4 w-4 mr-2" />Unpublish</Button>
              <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteDialog(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : sortedPosts?.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{getEmptyMessage()}</p>
            <Button onClick={onCreateNew}>Create Post</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts?.map((post) => {
              const isExpanded = expandedPosts.includes(post.id);
              return (
                <article key={post.id} className="bg-card rounded-2xl shadow-lg overflow-hidden border">
                  {/* Admin Actions Bar - Always visible */}
                  <div 
                    className="bg-muted/50 px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => toggleExpandPost(post.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={selectedPosts.includes(post.id)} 
                        onCheckedChange={() => toggleSelectPost(post.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {post.featured_image_url && (
                        <img src={post.featured_image_url} alt="" className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold line-clamp-1">{post.title}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge className={`${getCategoryColor(post.category)} text-white text-xs`}>
                            {getCategoryLabel(post.category)}
                          </Badge>
                          <span>{post.publication_date ? format(new Date(post.publication_date), 'MMM d, yyyy') : '-'}</span>
                          <span className="flex items-center gap-1"><Eye size={12} /> {post.view_count || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(post.id); }}>
                        <Edit className="h-4 w-4 mr-1" />Edit
                      </Button>
                      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleUnpublish(post.id); }}>
                        <EyeOff className="h-4 w-4 mr-1" />Unpublish
                      </Button>
                      <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setDeletePostId(post.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <>
                      {/* Featured Image */}
                      {post.featured_image_url && (
                        <div className="relative h-64 md:h-80 overflow-hidden">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6">
                            <Badge className={`${getCategoryColor(post.category)} text-white mb-3`}>
                              {getCategoryLabel(post.category)}
                            </Badge>
                            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white">
                              {post.title}
                            </h2>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 md:p-8">
                        {!post.featured_image_url && (
                          <>
                            <Badge className={`${getCategoryColor(post.category)} text-white mb-3`}>
                              {getCategoryLabel(post.category)}
                            </Badge>
                            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
                              {post.title}
                            </h2>
                          </>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                          <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {post.publication_date 
                              ? format(new Date(post.publication_date), 'MMMM d, yyyy')
                              : format(new Date(post.created_at), 'MMMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-2">
                            <User size={16} />
                            {post.author_name}
                          </span>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-lg text-muted-foreground italic mb-6 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Full Content */}
                        <div 
                          className="prose prose-lg max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Additional Images */}
                        {post.additional_images && post.additional_images.length > 0 && (
                          <div className="mt-8 pt-6 border-t">
                            <h4 className="font-semibold mb-4">Additional Images</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {post.additional_images.map((img, i) => (
                                <img 
                                  key={i} 
                                  src={img} 
                                  alt={`Additional ${i + 1}`} 
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete post?</AlertDialogTitle>
              <AlertDialogDescription>This post will be moved to trash and removed from /news.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedPosts.length} posts?</AlertDialogTitle>
              <AlertDialogDescription>These posts will be moved to trash.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">Delete All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
