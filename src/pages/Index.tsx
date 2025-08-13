import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, BookOpen, Heart, Shield, Users, Stethoscope, Brain, Activity, Clock, Star, CheckCircle, Globe, Smartphone, Calendar, FileText, Target, TrendingUp, Award, Lightbulb, ChevronRight, Phone, Mail, MapPin, Languages, ThumbsUp, Eye, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
const Index = () => {
  return <div className="min-h-screen">
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
              <img src={heroImage} alt="Doctori AI Health Assistant" className="rounded-2xl shadow-medical w-full animate-float" />
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
            <Link to="/chat">
              <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 cursor-pointer">
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
            </Link>
            
            <Link to="/doctors">
              <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 cursor-pointer">
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
            </Link>
            
            <Link to="/blog">
              <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 cursor-pointer">
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
            </Link>
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
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face" alt="Dr. Sarah Johnson" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-semibold mb-1">Dr. Sarah Johnson</h3>
                <Badge variant="secondary" className="mb-3">Cardiologist</Badge>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
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
                <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face" alt="Dr. Michael Chen" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-semibold mb-1">Dr. Michael Chen</h3>
                <Badge variant="secondary" className="mb-3">General Practice</Badge>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
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
                <img src="https://images.unsplash.com/photo-1594824797147-5cd0b4cf9e67?w=120&h=120&fit=crop&crop=face" alt="Dr. Emily Rodriguez" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-semibold mb-1">Dr. Emily Rodriguez</h3>
                <Badge variant="secondary" className="mb-3">Pediatrics</Badge>
                <div className="flex items-center justify-center space-x-1 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
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

      {/* Symptom Categories Section */}
      <section className="py-20 px-4 bg-gradient-subtle">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Common Health Concerns
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI is trained to help with a wide range of health symptoms and conditions
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[{
            icon: Brain,
            label: "Mental Health",
            desc: "Stress, anxiety, depression",
            color: "from-purple-500 to-purple-600"
          }, {
            icon: Heart,
            label: "Cardiovascular",
            desc: "Heart conditions, blood pressure",
            color: "from-red-500 to-red-600"
          }, {
            icon: Activity,
            label: "General Health",
            desc: "Common symptoms, wellness",
            color: "from-green-500 to-green-600"
          }, {
            icon: Eye,
            label: "Preventive Care",
            desc: "Health screening, lifestyle",
            color: "from-blue-500 to-blue-600"
          }].map((category, index) => <Link key={index} to="/chat">
                <Card className="shadow-card hover:shadow-medical transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`bg-gradient-to-br ${category.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">{category.desc}</p>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Daily Health Tips Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Daily Health Tips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert advice to keep you healthy and informed
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[{
            tip: "Stay hydrated by drinking at least 8 glasses of water daily",
            category: "Nutrition",
            icon: Target,
            color: "bg-blue-500"
          }, {
            tip: "Practice deep breathing for 5 minutes to reduce stress and anxiety",
            category: "Mental Health",
            icon: Brain,
            color: "bg-purple-500"
          }, {
            tip: "Take regular breaks from screen time to protect your vision",
            category: "Wellness",
            icon: Eye,
            color: "bg-green-500"
          }].map((tip, index) => <Link key={index} to="/blog">
                <Card className="shadow-card hover:shadow-medical transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`${tip.color} p-3 rounded-full flex-shrink-0`}>
                        <tip.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-3">{tip.category}</Badge>
                        <p className="text-muted-foreground leading-relaxed">{tip.tip}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>)}
          </div>
          
          <div className="text-center">
            <Link to="/blog">
              <Button variant="outline" size="lg">
                <Lightbulb className="mr-2 h-5 w-5" />
                More Health Tips
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Advanced AI Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge technology to support your health journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            icon: Languages,
            title: "Multi-Language Support",
            description: "Chat in your preferred language including English, Bengali, and more"
          }, {
            icon: Smartphone,
            title: "Mobile Optimized",
            description: "Access Doctori AI on any device, anywhere, anytime"
          }, {
            icon: Calendar,
            title: "Symptom Tracking",
            description: "Track your symptoms over time and share with doctors"
          }, {
            icon: FileText,
            title: "Health Reports",
            description: "Generate detailed health summaries and consultation reports"
          }, {
            icon: TrendingUp,
            title: "Progress Monitoring",
            description: "Monitor your health trends and improvements over time"
          }, {
            icon: Zap,
            title: "Instant Analysis",
            description: "Get immediate insights based on your symptoms and health data"
          }].map((feature, index) => <Card key={index} className="shadow-card hover:shadow-medical transition-all text-center">
                <CardContent className="p-6">
                  <div className="bg-gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real experiences from people who trust Doctori AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            name: "Sarah Miller",
            role: "Teacher",
            content: "Doctori AI helped me understand my symptoms before my doctor's appointment. The AI was so helpful and the doctor I found was excellent!",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=60&h=60&fit=crop&crop=face"
          }, {
            name: "Ahmed Rahman",
            role: "Software Engineer",
            content: "Being able to chat in Bengali made all the difference. The AI understood my concerns perfectly and connected me with a local doctor.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
          }, {
            name: "Maria Garcia",
            role: "Mother of 2",
            content: "As a busy mom, having 24/7 access to health guidance is invaluable. Doctori AI has become my trusted health companion.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
          }].map((testimonial, index) => <Card key={index} className="shadow-card hover:shadow-medical transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-20 px-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="bg-red-500 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-400">
              Emergency Medical Assistance
            </h2>
            <p className="text-lg text-red-600 dark:text-red-300 mb-6">
              If you're experiencing a medical emergency, please contact emergency services immediately
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-card">
              <h3 className="font-semibold mb-2">USA</h3>
              <p className="text-2xl font-bold text-red-600">911</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-card">
              <h3 className="font-semibold mb-2">UK</h3>
              <p className="text-2xl font-bold text-red-600">999</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-card">
              <h3 className="font-semibold mb-2">Bangladesh</h3>
              <p className="text-2xl font-bold text-red-600">Call - 999 
Call Center – 16263</p>
            </div>
          </div>
          
          <p className="text-sm text-red-500 mt-6">
            Remember: Doctori AI is not a substitute for emergency medical care
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Doctori AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[{
            question: "Is Doctori AI free to use?",
            answer: "Yes! Our AI health assistant is completely free. You can chat without creating an account. Premium features like PDF reports require registration."
          }, {
            question: "How accurate is the AI diagnosis?",
            answer: "Doctori AI provides general health guidance, not medical diagnosis. Always consult with qualified healthcare professionals for medical decisions."
          }, {
            question: "Can I use Doctori AI in my language?",
            answer: "Yes! We support multiple languages including English, Bengali, and more. Select your preferred language from the dropdown menu."
          }, {
            question: "Is my health data secure?",
            answer: "Absolutely. We use medical-grade security and are HIPAA compliant. Your health information is encrypted and protected."
          }, {
            question: "How do I book an appointment with a doctor?",
            answer: "After chatting with our AI, you'll be shown nearby verified doctors. Click on any doctor to view their profile and book an appointment."
          }, {
            question: "Can doctors join Doctori AI platform?",
            answer: "Yes! Healthcare professionals can register through our 'Join with Us' section. All doctors undergo verification before being listed."
          }].map((faq, index) => <Card key={index} className="shadow-card hover:shadow-medical transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Doctori AI for their health guidance. Start your journey to better health today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/chat">
              <Button variant="medical" size="lg" className="text-lg px-8 w-full sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Free Chat
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="healing" size="lg" className="text-lg px-8 w-full sm:w-auto">
                <Stethoscope className="mr-2 h-5 w-5" />
                Find Doctors
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="hero" size="lg" className="text-lg px-8 w-full sm:w-auto">
                <Award className="mr-2 h-5 w-5" />
                Create Account
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-blue-500 mr-2" />
              HIPAA compliant
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-purple-500 mr-2" />
              24/7 available
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;