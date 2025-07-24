import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Heart, 
  MessageCircle, 
  Users, 
  BookOpen, 
  Info, 
  Mail,
  LogOut,
  User,
  Stethoscope
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSelector } from "@/components/LanguageSelector";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
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
          <Link 
            to="/" 
            className={`text-foreground hover:text-primary transition-colors ${
              isActive('/') ? 'text-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>Home</span>
            </div>
          </Link>
          <Link 
            to="/chat" 
            className={`text-foreground hover:text-primary transition-colors ${
              isActive('/chat') ? 'text-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>AI Chat</span>
            </div>
          </Link>
          <Link 
            to="/doctors" 
            className={`text-foreground hover:text-primary transition-colors ${
              isActive('/doctors') ? 'text-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>Find Doctors</span>
            </div>
          </Link>
          <Link 
            to="/blog" 
            className={`text-foreground hover:text-primary transition-colors ${
              isActive('/blog') ? 'text-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>Health Blog</span>
            </div>
          </Link>
          <Link 
            to="/about" 
            className={`text-foreground hover:text-primary transition-colors ${
              isActive('/about') ? 'text-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <Info className="h-4 w-4" />
              <span>About</span>
            </div>
          </Link>
          <Link 
            to="/contact" 
            className={`text-foreground hover:text-primary transition-colors ${
              isActive('/contact') ? 'text-primary' : ''
            }`}
          >
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </div>
          </Link>
        </div>

        {/* Language selector and Auth buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <LanguageSelector />
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Welcome back</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <div className="container py-4 space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/chat" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Chat</span>
              </Link>
              <Link 
                to="/doctors" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>Find Doctors</span>
              </Link>
              <Link 
                to="/blog" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Health Blog</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              
              <div className="pt-4 border-t">
                <LanguageSelector />
                <div className="mt-3 space-y-2">
                  {user ? (
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/login" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};