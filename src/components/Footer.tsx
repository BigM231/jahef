import { Link } from "react-router-dom";
import { Facebook, Send, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/jahef-logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="JAHEF Logo" className="h-16 w-16 object-contain" />
              <div>
                <h3 className="font-heading font-bold text-xl">JAHEF</h3>
                <p className="text-sm opacity-90">
                  Jessica Akpobi Health Empowering Foundation
                </p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed max-w-md">
              Transforming lives through compassion and community support.
              Empowering children, women, youth, and widows through health
              education, school support, and community initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm opacity-90 hover:opacity-100 transition-opacity"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className="text-sm opacity-90 hover:opacity-100 transition-opacity"
                >
                  Our Programs
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-sm opacity-90 hover:opacity-100 transition-opacity"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-sm opacity-90 hover:opacity-100 transition-opacity"
                >
                  News & Events
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm opacity-90 hover:opacity-100 transition-opacity"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm opacity-90">
                  Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm opacity-90">+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm opacity-90">
                  info@jahef.org
                </span>
              </li>
            </ul>

            <div className="flex gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="TikTok"
              >
                <Send size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-90">
            © {new Date().getFullYear()} Jessica Akpobi Health Empowering
            Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
