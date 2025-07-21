import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Heart, 
  Users, 
  Brain, 
  Award, 
  Lock,
  MessageCircle,
  Stethoscope
} from "lucide-react";

export default function About() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            About Doctori AI
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Your Trusted{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Health Companion
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Doctori AI combines advanced artificial intelligence with medical expertise to provide 
            accessible, reliable health guidance for everyone. We're here to bridge the gap between 
            you and quality healthcare.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="shadow-medical mb-12">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                To make healthcare more accessible, understandable, and personal for everyone, 
                everywhere. We believe that quality health guidance shouldn't be limited by 
                geography, time, or circumstance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How Doctori AI Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="bg-gradient-primary p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">1. Chat with AI</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your symptoms or health concerns in natural language
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="bg-gradient-healing p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your input using medical knowledge and guidelines
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-accent to-accent/80 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">3. Get Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Receive personalized advice and doctor recommendations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust & Security */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Trust & Security</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
                    <p className="text-sm text-muted-foreground">
                      Your health information is protected with medical-grade security and privacy standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Lock className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      All conversations and data are encrypted end-to-end for maximum security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Medical Sources</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI is trained on verified medical literature and clinical guidelines.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Doctor Verified</h3>
                    <p className="text-sm text-muted-foreground">
                      All medical professionals on our platform are verified and licensed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="bg-muted/30 border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-primary">Important Medical Disclaimer</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Doctori AI provides health information and guidance for educational purposes only. 
              Our AI assistant is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with qualified healthcare providers for medical concerns.
            </p>
            <p className="text-sm text-muted-foreground">
              In case of medical emergencies, contact your local emergency services immediately.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who trust Doctori AI for their health guidance
          </p>
          <Button variant="medical" size="lg" className="text-lg px-8">
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat with Doctori AI
          </Button>
        </div>
      </div>
    </div>
  );
}