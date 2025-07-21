import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Heart, Stethoscope } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Doctori AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/doctors" className="text-foreground hover:text-primary transition-colors">
            Find Doctors
          </Link>
          <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
            Health Blog
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          <Button variant="hero" size="sm">
            Start Chat
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 space-y-4">
              <Link to="/" className="block text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/doctors" className="block text-foreground hover:text-primary transition-colors">
                Find Doctors
              </Link>
              <Link to="/blog" className="block text-foreground hover:text-primary transition-colors">
                Health Blog
              </Link>
              <Link to="/about" className="block text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Button variant="hero" size="sm" className="w-full">
                Start Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};