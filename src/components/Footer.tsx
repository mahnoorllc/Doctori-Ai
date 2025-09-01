import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageCircle, Smartphone, Download } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Doctori AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted virtual health assistant, available 24/7 to guide you on your wellness journey.
            </p>
            <Link to="/chat">
              <Button variant="medical" size="sm" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chat Now
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/doctors" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Doctors
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Health Blog
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1-800-DOCTORI</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@doctoriai.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Available Now Worldwide</span>
              </div>
            </div>
          </div>

          {/* Download Apps */}
          <div className="space-y-4">
            <h3 className="font-semibold">Download Our Apps</h3>
            <p className="text-sm text-muted-foreground">
              Get Doctori AI on your mobile device
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Google Play Store
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Smartphone className="h-4 w-4 mr-2" />
                Apple App Store
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Coming soon to mobile platforms
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Health Updates</h3>
            <p className="text-sm text-muted-foreground">
              Get weekly health tips from Doctori AI
            </p>
            <div className="space-y-2">
              <Input placeholder="Enter your email" className="text-sm" />
              <Button variant="healing" size="sm" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">© 2025 Doctori AI, Mahnoor LLC. Powered by care, guided by AI.</div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t opacity-60">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            <span>Medical Grade Security</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>24/7 Available</span>
          </div>
        </div>
      </div>
    </footer>;
};