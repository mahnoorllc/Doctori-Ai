import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  Heart,
  Shield,
  Users
} from "lucide-react";

export default function Contact() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Get in Touch
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Contact{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Doctori AI
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about your health or our platform? We're here to help. 
            Reach out to our support team or start a chat with our AI assistant.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-primary" />
                <span>Send us a Message</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter your email address" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="What's this about?" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button variant="medical" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Get Immediate Help</h3>
                
                <div className="space-y-4">
                  <Button variant="hero" className="w-full justify-start text-left h-auto p-4">
                    <MessageCircle className="mr-3 h-5 w-5" />
                    <div>
                      <div className="font-medium">Chat with AI Now</div>
                      <div className="text-sm opacity-70">Get instant health guidance</div>
                    </div>
                  </Button>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Emergency Hotline</div>
                      <div className="text-sm text-muted-foreground">+1-800-DOCTORI</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Mail className="h-5 w-5 text-secondary" />
                    <div>
                      <div className="font-medium">Email Support</div>
                      <div className="text-sm text-muted-foreground">support@doctoriai.com</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Support Hours
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>AI Assistant</span>
                    <span className="text-secondary font-medium">24/7 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Human Support</span>
                    <span>Mon-Fri: 8AM-8PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Line</span>
                    <span className="text-destructive font-medium">24/7 Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="shadow-card bg-gradient-hero">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Why Trust Doctori AI?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">HIPAA Compliant</div>
                      <div className="text-sm text-muted-foreground">Your privacy is protected</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-secondary mt-0.5" />
                    <div>
                      <div className="font-medium">Verified Doctors</div>
                      <div className="text-sm text-muted-foreground">All professionals are licensed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Heart className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <div className="font-medium">Trusted by 10,000+</div>
                      <div className="text-sm text-muted-foreground">Users worldwide</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Is Doctori AI a replacement for my doctor?</h4>
                <p className="text-sm text-muted-foreground">
                  No, Doctori AI provides guidance and information but should not replace professional medical care. Always consult healthcare providers for medical decisions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">How secure is my health information?</h4>
                <p className="text-sm text-muted-foreground">
                  We use medical-grade encryption and are HIPAA compliant. Your conversations and data are kept completely private and secure.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Is the AI chatbot free to use?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! Our AI health assistant is completely free. You only pay when booking appointments with doctors through our platform.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">Can I book real doctor appointments?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! We connect you with verified, licensed healthcare professionals in your area who you can book appointments with directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}