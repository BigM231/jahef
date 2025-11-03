import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import newsImage1 from "@/assets/gallery/school-materials-distribution-2.jpg";
import newsImage2 from "@/assets/gallery/school-visit-7.jpg";
import newsImage3 from "@/assets/gallery/community-outreach-1.jpg";

const News = () => {
  const articles = [
    {
      title: "Successful School Materials Distribution at UBEC Lagos",
      excerpt:
        "JAHEF distributed essential school materials to over 200 students, bringing joy and renewed hope for education to children across Lagos communities.",
      date: "October 21, 2025",
      readTime: "3 min read",
      category: "School Support",
      image: newsImage1,
    },
    {
      title: "Deworming Program Reaches 10 Schools",
      excerpt:
        "Our health initiative has successfully implemented deworming programs across 10 schools, improving health outcomes for hundreds of children.",
      date: "September 15, 2025",
      readTime: "4 min read",
      category: "Health Education",
      image: newsImage2,
    },
    {
      title: "Community Empowerment Workshop for Women",
      excerpt:
        "JAHEF hosted an empowering workshop focused on skills development and economic opportunities for women in underserved communities.",
      date: "August 30, 2025",
      readTime: "5 min read",
      category: "Community Empowerment",
      image: newsImage3,
    },
  ];

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

      {/* Articles Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-secondary text-white text-xs font-secondary font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <button className="inline-flex items-center gap-2 text-primary font-secondary font-semibold hover:gap-3 transition-all">
                    Read More <ArrowRight size={18} />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-hero text-white font-secondary font-bold text-lg rounded-full hover:opacity-90 transition-opacity"
            >
              Contact Us for Information
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
