import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Stethoscope, ChevronDown, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRoleBasedAuth } from "@/hooks/useRoleBasedAuth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useRoleBasedAuth();
  const { t } = useLanguage(); // <-- use translations here
  const [isOpen, setIsOpen] = useState(false);

  const getDashboardPath = () => {
    if (!profile) return '/login';
    switch (profile.role) {
      case 'user': return '/dashboard/user';
      case 'provider': return profile.approval_status === 'approved' ? '/dashboard/provider' : '/dashboard/provider/pending';
      case 'admin': return '/dashboard/admin';
      default: return '/login';
    }
  };

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
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Doctori AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={`text-foreground hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : ''}`}>
            {t('home') || 'Home'}
          </Link>
          <Link to="/chat" className={`text-foreground hover:text-primary transition-colors ${isActive('/chat') ? 'text-primary' : ''}`}>
            {t('chat.title')}
          </Link>
          <Link to="/doctors" className={`text-foreground hover:text-primary transition-colors ${isActive('/doctors') ? 'text-primary' : ''}`}>
            {t('findDoctors') || 'Find Doctors'}
          </Link>
          <Link to="/medicine" className={`text-foreground hover:text-primary transition-colors ${isActive('/medicine') ? 'text-primary' : ''}`}>
            {t('searchMedicine') || 'Search Medicine'}
          </Link>

          {/* Become a Provider link */}
          {!user && (
            <Link to="/register/provider" className={`text-foreground hover:text-primary transition-colors ${isActive('/register/provider') ? 'text-primary' : ''}`}>
              <div className="flex items-center space-x-1">
                <UserPlus className="h-4 w-4" />
                <span>{t('becomeProvider') || 'Become a Provider'}</span>
              </div>
            </Link>
          )}

          {/* Health Blog Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`flex items-center space-x-1 ${isBlogActive ? 'text-primary' : ''}`}>
                <span>{t('healthBlog') || 'Health Blog'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border z-50">
              <DropdownMenuItem asChild>
                <Link to="/blog" className="w-full">{t('allBlogs') || 'All Blogs'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/blog/health-tips-bd" className="w-full">{t('healthTips') || 'Health Tips'}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dashboard link */}
          {user && profile && (
            <Link to={getDashboardPath()} className={`text-foreground hover:text-primary transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-primary' : ''}`}>
              {t('dashboard') || 'Dashboard'}
            </Link>
          )}
        </div>

        {/* Language selector & Auth buttons */}
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

        {/* Mobile Menu */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden z-50">
            <div className="container py-4 space-y-4">
              <Link to="/" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                {t('home') || 'Home'}
              </Link>
              <Link to="/chat" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                {t('chat.title')}
              </Link>
              <Link to="/doctors" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                {t('findDoctors') || 'Find Doctors'}
              </Link>
              <Link to="/medicine" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                {t('searchMedicine') || 'Search Medicine'}
              </Link>

              {!user && (
                <Link to="/register/provider" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>{t('becomeProvider') || 'Become a Provider'}</span>
                  </div>
                </Link>
              )}

              {/* Mobile Health Blog */}
              <div className="py-2">
                <p className="text-foreground font-medium mb-2">{t('healthBlog') || 'Health Blog'}</p>
                <Link to="/blog" className="block text-foreground hover:text-primary transition-colors py-1 pl-4" onClick={() => setIsOpen(false)}>
                  {t('allBlogs') || 'All Blogs'}
                </Link>
                <Link to="/blog/health-tips-bd" className="block text-foreground hover:text-primary transition-colors py-1 pl-4" onClick={() => setIsOpen(false)}>
                  {t('healthTips') || 'Health Tips'}
                </Link>
              </div>

              {user && profile && (
                <Link to={getDashboardPath()} className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                  {t('dashboard') || 'Dashboard'}
                </Link>
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
