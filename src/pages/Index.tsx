import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Search, 
  BookOpen, 
  Heart, 
  Shield, 
  Users, 
  Stethoscope,
  Brain,
  Activity,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  🩺 Your AI Health Assistant
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Meet{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Doctori AI
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Chat with our AI to understand your symptoms, get helpful tips, and find the right doctor near you. Your health journey starts here.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="medical" size="lg" className="text-lg px-8">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Chat
                </Button>
                <Button variant="hero" size="lg" className="text-lg px-8">
                  <Search className="mr-2 h-5 w-5" />
                  Find Doctors
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Health Blog
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={heroImage}
                alt="Doctori AI Health Assistant"
                className="rounded-2xl shadow-medical w-full animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How Doctori AI Helps You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized health guidance, connect with doctors, and stay informed about your wellbeing
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Health Assistant</h3>
                <p className="text-muted-foreground">
                  Chat with our intelligent AI to understand symptoms and get personalized health guidance 24/7.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-healing p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Find Doctors</h3>
                <p className="text-muted-foreground">
                  Connect with verified healthcare professionals in your area and book appointments instantly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Health Education</h3>
                <p className="text-muted-foreground">
                  Stay informed with expert articles, tips, and resources for better health and wellness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Thousands</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">500+</div>
              <div className="text-muted-foreground">Verified Doctors</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <Shield className="h-8 w-8" />
            <span className="text-sm">HIPAA Compliant</span>
            <Activity className="h-8 w-8" />
            <span className="text-sm">Medical Grade Security</span>
            <Heart className="h-8 w-8" />
            <span className="text-sm">Trusted Care</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your health journey today with Doctori AI. Get instant guidance, connect with doctors, and access trusted health information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="medical" size="lg" className="text-lg px-8">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with AI Now
            </Button>
            <Link to="/doctors">
              <Button variant="healing" size="lg" className="text-lg px-8 w-full sm:w-auto">
                <Stethoscope className="mr-2 h-5 w-5" />
                Browse Doctors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
