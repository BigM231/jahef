import { useState } from "react";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TikTokIcon from "@/components/TikTokIcon";
import logo from "@/assets/jahef-logo.png";
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be handled by admin dashboard
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll respond soon."
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            We're here to listen, support, and collaborate. Reach out to us for
            any inquiries or support
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl shadow-xl p-8">
              <h2 className="font-heading font-bold text-3xl mb-6 text-primary">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-secondary font-semibold mb-2">
                    Full Name *
                  </label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="rounded-lg" placeholder="Enter your full name" />
                </div>

                <div>
                  <label htmlFor="email" className="block font-secondary font-semibold mb-2">
                    Email Address *
                  </label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="rounded-lg" placeholder="your.email@example.com" />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-secondary font-semibold mb-2">
                    Phone Number
                  </label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="rounded-lg" placeholder="+234 XXX XXX XXXX" />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-secondary font-semibold mb-2">
                    Subject *
                  </label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="rounded-lg" placeholder="What is this regarding?" />
                </div>

                <div>
                  <label htmlFor="message" className="block font-secondary font-semibold mb-2">
                    Message *
                  </label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="rounded-lg" placeholder="Tell us how we can help..." />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-hero text-white font-secondary font-bold hover:opacity-90 transition-opacity rounded-full">
                  Send Message
                  <Send className="ml-2" size={18} />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gradient-card rounded-2xl shadow-lg p-8">
                <h2 className="font-heading font-bold text-3xl mb-6 text-primary">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-secondary font-semibold text-lg mb-1">
                        Location
                      </h3>
                      <p className="text-muted-foreground">
                        13 Memudu Bada St, Ikotun, Lagos 102213, Lagos, Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-secondary font-semibold text-lg mb-1">
                        Phone
                      </h3>
                      <p className="text-muted-foreground">
                        +234 81-0543-6168
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-secondary font-semibold text-lg mb-1">
                        Email
                      </h3>
                      <p className="text-muted-foreground">info@jahef.org</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-card rounded-2xl shadow-lg p-8">
                <h3 className="font-heading font-bold text-2xl mb-4 text-primary">
                  Follow Us
                </h3>
                <p className="text-muted-foreground mb-6">
                  Stay connected with our work and updates on social media
                </p>
                <div className="flex gap-4">
                  <a href="https://facebook.com/JessicaAkpobiHealthEmpoweringFoundation" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full transition-colors" aria-label="Facebook">
                    <Facebook size={24} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-colors" aria-label="Instagram">
                    <Instagram size={24} />
                  </a>
                  <a href="https://tiktok.com/@J_h_empowered_foundation" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-900 text-white p-3 rounded-full transition-colors" aria-label="TikTok">
                    <TikTokIcon size={24} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-900 text-white p-3 rounded-full transition-colors" aria-label="X (Twitter)">
                    <Twitter size={24} />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors" aria-label="YouTube">
                    <Youtube size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Contact;