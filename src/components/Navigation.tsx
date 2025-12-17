import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/jahef-logo-color.png";
import { useAdminStatus } from "@/hooks/useAdminStatus";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAdminStatus();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Programs", path: "/programs" },
    { name: "Gallery", path: "/gallery" },
    { name: "News & Events", path: "/news" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="JAHEF Logo" className="h-14 w-14" />
            <div className="hidden md:block">
              <div className="font-heading font-bold text-primary text-lg leading-tight">
                JAHEF
              </div>
              <div className="text-xs text-muted-foreground">
                Empowering Foundation
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-secondary font-semibold transition-colors text-sm xl:text-base ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link to="/admin/blog">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText size={16} />
                    Blog Admin
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload size={16} />
                    Upload
                  </Button>
                </Link>
              </>
            )}
            <Link to="/donate">
              <Button className="bg-gradient-hero text-white font-secondary font-bold hover:opacity-90 transition-opacity rounded-full px-6">
                Donate Now
              </Button>
            </Link>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile & Tablet Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 font-secondary font-semibold rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link to="/admin/blog" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <FileText size={16} />
                    Blog Admin
                  </Button>
                </Link>
                <Link to="/upload" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Upload size={16} />
                    Upload Media
                  </Button>
                </Link>
              </>
            )}
            <Link to="/donate" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-4 bg-gradient-hero text-white font-secondary font-bold hover:opacity-90 transition-opacity rounded-full">
                Donate Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
