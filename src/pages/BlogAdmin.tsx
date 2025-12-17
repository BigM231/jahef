import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FileText, ArrowLeft, Plus, List, Trash2 } from 'lucide-react';
import BlogPostsList from '@/components/admin/BlogPostsList';
import BlogPostForm from '@/components/admin/BlogPostForm';

type AdminView = 'list' | 'trash' | 'create' | 'edit';

export default function BlogAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<AdminView>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleEdit = (id: string) => {
    setEditingPostId(id);
    setCurrentView('edit');
  };

  const handleCreateNew = () => {
    setEditingPostId(null);
    setCurrentView('create');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingPostId(null);
  };

  if (!user) {
    return null;
  }

  const showForm = currentView === 'create' || currentView === 'edit';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">News & Events Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <BlogPostForm 
            editId={editingPostId} 
            onBack={handleBackToList} 
            user={user} 
          />
        ) : (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="posts" className="gap-2">
                    <List className="h-4 w-4" />
                    All Posts
                  </TabsTrigger>
                  <TabsTrigger value="trash" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Trash
                  </TabsTrigger>
                </TabsList>
                <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </div>
              
              <TabsContent value="posts">
                <BlogPostsList 
                  onEdit={handleEdit} 
                  onCreateNew={handleCreateNew}
                  showTrash={false}
                />
              </TabsContent>
              
              <TabsContent value="trash">
                <BlogPostsList 
                  onEdit={handleEdit} 
                  onCreateNew={handleCreateNew}
                  showTrash={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
