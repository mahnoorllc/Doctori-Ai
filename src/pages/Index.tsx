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
                  Chat with our AI to understand your symptoms, receive health suggestions, and connect with nearby doctors instantly.
                </p>
                <p className="text-lg text-muted-foreground/80 leading-relaxed">
                  Your trusted virtual health companion, available 24/7 to guide you on your wellness journey.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat">
                  <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start Chat
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Find Doctors
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Health Blog
                  </Button>
                </Link>
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

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get help in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 text-center">
              <CardContent className="p-8">
                <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">1. Ask Your Symptoms</h3>
                <p className="text-muted-foreground">
                  Describe your health concerns to our intelligent AI assistant in natural language.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 text-center">
              <CardContent className="p-8">
                <div className="bg-gradient-healing p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">2. Get Instant Advice</h3>
                <p className="text-muted-foreground">
                  Receive personalized health guidance and recommendations based on your symptoms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 text-center">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-accent to-accent/80 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">3. Connect with a Doctor</h3>
                <p className="text-muted-foreground">
                  Find and book appointments with verified healthcare professionals near you.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Your Complete Health Companion
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

      {/* Featured Doctors Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Doctors</h2>
            <p className="text-muted-foreground">
              Meet some of our trusted healthcare professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-card hover:shadow-medical transition-all">
              <CardContent className="p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face"
                  alt="Dr. Sarah Johnson"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold mb-1">Dr. Sarah Johnson</h3>
                <Badge variant="secondary" className="mb-3">Cardiologist</Badge>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.8 (127 reviews)</span>
                </div>
                <Badge className="bg-green-100 text-green-700 mb-4">🟢 Available Today</Badge>
                <Link to="/doctor/1">
                  <Button variant="medical" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-medical transition-all">
              <CardContent className="p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face"
                  alt="Dr. Michael Chen"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold mb-1">Dr. Michael Chen</h3>
                <Badge variant="secondary" className="mb-3">General Practice</Badge>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9 (203 reviews)</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700 mb-4">⭐ Top Rated</Badge>
                <Link to="/doctor/2">
                  <Button variant="medical" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="shadow-card hover:shadow-medical transition-all">
              <CardContent className="p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1594824797147-5cd0b4cf9e67?w=120&h=120&fit=crop&crop=face"
                  alt="Dr. Emily Rodriguez"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold mb-1">Dr. Emily Rodriguez</h3>
                <Badge variant="secondary" className="mb-3">Pediatrics</Badge>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.7 (89 reviews)</span>
                </div>
                <Badge className="bg-purple-100 text-purple-700 mb-4">✅ Verified</Badge>
                <Link to="/doctor/3">
                  <Button variant="medical" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link to="/doctors">
              <Button variant="outline" size="lg">
                View All Doctors
              </Button>
            </Link>
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
            <Link to="/chat">
              <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with AI Now
              </Button>
            </Link>
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
