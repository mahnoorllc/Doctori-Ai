
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Stethoscope, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const isBlogActive = location.pathname.startsWith('/blog');

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
          <Link to="/" className={`text-foreground hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : ''}`}>
            Home
          </Link>
          <Link to="/chat" className={`text-foreground hover:text-primary transition-colors ${isActive('/chat') ? 'text-primary' : ''}`}>
            AI Health Assistant
          </Link>
          <Link to="/doctors" className={`text-foreground hover:text-primary transition-colors ${isActive('/doctors') ? 'text-primary' : ''}`}>
            Find Doctors
          </Link>
          <Link to="/medicine" className={`text-foreground hover:text-primary transition-colors ${isActive('/medicine') ? 'text-primary' : ''}`}>
            Search Medicine
          </Link>
          
          {/* Health Blog Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center space-x-1 ${isBlogActive ? 'text-primary' : ''}`}>
                <span>Health Blog</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border z-50">
              <DropdownMenuItem asChild>
                <Link to="/blog" className="w-full">All Blogs</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blog/health-tips-bd" className="w-full">Health Tips (BD)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Dashboard</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border z-50">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">User Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/doctor-dashboard">Doctor Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Language selector and Auth buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <LanguageSelector />
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden z-50">
            <div className="container py-4 space-y-4">
              <Link to="/" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/chat" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                AI Health Assistant
              </Link>
              <Link to="/doctors" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                Find Doctors
              </Link>
              <Link to="/medicine" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                Search Medicine
              </Link>
              
              {/* Mobile Health Blog Section */}
              <div className="py-2">
                <p className="text-foreground font-medium mb-2">Health Blog</p>
                <Link to="/blog" className="block text-foreground hover:text-primary transition-colors py-1 pl-4" onClick={() => setIsOpen(false)}>
                  All Blogs
                </Link>
                <Link to="/blog/health-tips-bd" className="block text-foreground hover:text-primary transition-colors py-1 pl-4" onClick={() => setIsOpen(false)}>
                  Health Tips (BD)
                </Link>
              </div>
              
              {user && (
                <>
                  <Link to="/dashboard" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                    User Dashboard
                  </Link>
                  <Link to="/doctor-dashboard" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                    Doctor Dashboard
                  </Link>
                  <Link to="/admin" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                    Admin Panel
                  </Link>
                </>
              )}
              
              <div className="pt-4 border-t">
                <LanguageSelector />
                <div className="mt-3 space-y-2">
                  {user ? (
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Link to="/login" className="block">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4" />
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
