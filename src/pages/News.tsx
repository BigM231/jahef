import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

const News = () => {
  const [category, setCategory] = useState<BlogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, isLoading } = usePublishedPosts(
    category === 'all' ? undefined : category,
    searchQuery || undefined
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            News & Events
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Stay updated with our latest activities, success stories, and
            upcoming events
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

      {/* Blog Posts */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchQuery || category !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back soon for new articles and updates.'}
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-8">
                {category === 'all' ? 'All News & Events' : getCategoryLabel(category as BlogCategory)}
                <span className="text-muted-foreground text-lg font-normal ml-2">
                  ({posts.length} {posts.length === 1 ? 'article' : 'articles'})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-none shadow-lg rounded-2xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(post.category)} text-white`}>
                          {getCategoryLabel(post.category)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {post.publication_date 
                            ? format(new Date(post.publication_date), 'MMM d, yyyy')
                            : 'Draft'}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {post.author_name}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                      </p>
                      <Link to={`/blog/${post.slug}`}>
                        <Button className="w-full bg-gradient-hero text-white hover:opacity-90">
                          Read More <ArrowRight size={18} className="ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-center text-primary mb-12">
            Upcoming Events
          </h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Stay tuned for announcements about our upcoming community events,
              health education sessions, and support programs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-hero text-white font-secondary font-bold text-lg rounded-full hover:opacity-90 transition-opacity"
            >
              Contact Us for Information
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
