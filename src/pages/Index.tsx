import { Link } from "react-router-dom";
import { Heart, Users, GraduationCap, HandHeart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import logo from "@/assets/jahef-logo.png";
import galleryImage1 from "@/assets/gallery/school-visit-1.jpeg";
import galleryImage2 from "@/assets/gallery/founder-with-children-2.jpeg";
import galleryImage3 from "@/assets/gallery/school-materials-new.jpeg";
const Index = () => {
  const programs = [{
    icon: <Heart className="w-12 h-12 text-secondary" />,
    title: "Health Education",
    description: "Providing essential health education and preventive care to communities, focusing on deworming programs that improve health and school participation.",
    color: "from-secondary/20 to-secondary/10"
  }, {
    icon: <GraduationCap className="w-12 h-12 text-accent" />,
    title: "School Support",
    description: "Distributing school materials including notebooks, uniforms, sandals, and school bags to ensure children can attend school with dignity and preparedness.",
    color: "from-accent/20 to-accent/10"
  }, {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: "Community Empowerment",
    description: "Supporting women, youth, widows, and families through programs that provide resources, encouragement, and pathways to self-sufficiency.",
    color: "from-primary/20 to-primary/10"
  }];
  const stats = [{
    number: "500+",
    label: "Children Supported"
  }, {
    number: "10+",
    label: "Schools Reached"
  }, {
    number: "50+",
    label: "Families Empowered"
  }, {
    number: "100%",
    label: "Hearts Touched"
  }];
  return <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-6">
                
              </div>
              <h1 className="font-heading font-bold text-4xl md:text-6xl text-white leading-tight mb-6">
                Transforming Lives Through Compassion
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Jessica Akpobi Health Empowering Foundation empowers children,
                women, youth, and the needy through health education, school
                support, and genuine community care in Lagos, Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/donate">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-secondary font-bold text-lg px-8 rounded-full">
                    Donate Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-secondary font-bold text-lg px-8 rounded-full">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img src={galleryImage1} alt="JAHEF community work" className="rounded-2xl shadow-2xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="font-heading font-bold text-4xl md:text-5xl text-primary mb-2">
                  {stat.number}
                </div>
                <div className="font-secondary text-muted-foreground">
                  {stat.label}
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Making a difference through targeted initiatives that address real
              needs and create lasting change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                <CardContent className="p-8">
                  <div className="mb-6">{program.icon}</div>
                  <h3 className="font-heading font-bold text-2xl mb-4">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {program.description}
                  </p>
                  <Link to="/programs" className="inline-flex items-center gap-2 text-primary font-secondary font-semibold hover:gap-3 transition-all">
                    Learn More <ArrowRight size={18} />
                  </Link>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Impact Gallery */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-4">
              See Our Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Witness the joy and transformation in the communities we serve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src={galleryImage1} alt="School visit" className="rounded-xl w-full h-64 object-cover shadow-lg hover:shadow-xl transition-shadow" />
            <img src={galleryImage2} alt="Founder with children" className="rounded-xl w-full h-64 object-cover shadow-lg hover:shadow-xl transition-shadow" />
            <img src={galleryImage3} alt="Materials distribution" className="rounded-xl w-full h-64 object-cover shadow-lg hover:shadow-xl transition-shadow" />
          </div>

          <div className="text-center mt-8">
            <Link to="/gallery">
              <Button variant="outline" size="lg" className="font-secondary font-semibold rounded-full">
                View Full Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <HandHeart className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6">
            Be Part of the Change
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your support helps us provide genuine care and support to those who
            need it most. Together, we can transform lives and build stronger
            communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-secondary font-bold text-lg px-8 rounded-full">
                Make a Donation
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-secondary font-bold text-lg px-8 rounded-full">
                Get Involved
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;