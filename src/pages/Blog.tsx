import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { 
  usePublishedPosts, 
  BlogCategory, 
  getCategoryLabel, 
  getCategoryColor 
} from '@/hooks/useBlogPosts';
import { format } from 'date-fns';

const CATEGORIES: { value: BlogCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'success_stories', label: 'Success Stories' },
  { value: 'program_updates', label: 'Program Updates' },
  { value: 'emergency_appeals', label: 'Emergency Appeals' },
  { value: 'community_news', label: 'Community News' },
  { value: 'case_studies', label: 'Case Studies' },
];

export default function Blog() {
  const [category, setCategory] = useState<BlogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, isLoading } = usePublishedPosts(
    category === 'all' ? undefined : category,
    searchQuery || undefined
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
              Blog & News
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stories of hope, program updates, and news from JAHEF's mission to support 
              families and communities in need.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select category" />
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
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Check back soon for new stories and updates'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post) => (
                  <Card 
                    key={post.id} 
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video overflow-hidden">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${getCategoryColor(post.category)} text-white`}>
                          {getCategoryLabel(post.category)}
                        </Badge>
                        {post.is_series && post.series_name && (
                          <Badge variant="outline" className="text-xs">
                            Part {post.series_part}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.publication_date 
                            ? format(new Date(post.publication_date), 'MMM d, yyyy')
                            : 'Draft'}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author_name}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`}>
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Posts Sidebar (for larger screens, shown as section) */}
        {posts && posts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
                  <Button
                    key={cat.value}
                    variant={category === cat.value ? 'default' : 'outline'}
                    onClick={() => setCategory(cat.value as any)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
