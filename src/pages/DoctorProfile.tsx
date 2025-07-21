import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  Heart,
  Share2,
  Award,
  Users,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

// This would normally come from an API or database
const getDoctorById = (id: string) => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.8,
      reviews: 127,
      location: "Medical Center Downtown",
      address: "123 Health Ave, Downtown Medical District",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@medcenter.com",
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      bio: "Dr. Johnson is an experienced cardiologist with over 15 years of expertise in treating heart conditions. She specializes in preventive cardiology and advanced cardiac interventions.",
      education: ["MD - Harvard Medical School", "Residency - Mayo Clinic", "Fellowship - Johns Hopkins"],
      certifications: ["Board Certified in Cardiology", "American Heart Association Fellow"],
      languages: ["English", "Spanish"],
      experience: "15+ years",
      consultationFee: "$200",
      hours: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM", 
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 3:00 PM",
        saturday: "10:00 AM - 2:00 PM",
        sunday: "Closed"
      }
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "General Practice",
      rating: 4.9,
      reviews: 203,
      location: "Community Health Clinic",
      address: "456 Wellness Blvd, Community Health Center",
      phone: "+1 (555) 234-5678",
      email: "michael.chen@healthclinic.com",
      availability: "Next Available: Tomorrow",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      bio: "Dr. Chen is a dedicated family medicine physician focused on preventive care, wellness, and comprehensive healthcare for patients of all ages.",
      education: ["MD - Stanford University", "Residency - UCSF", "Fellowship - Family Medicine"],
      certifications: ["Board Certified in Family Medicine", "Certified in Preventive Medicine"],
      languages: ["English", "Mandarin", "Cantonese"],
      experience: "12+ years",
      consultationFee: "$150",
      hours: {
        monday: "8:00 AM - 6:00 PM",
        tuesday: "8:00 AM - 6:00 PM",
        wednesday: "8:00 AM - 6:00 PM",
        thursday: "8:00 AM - 6:00 PM",
        friday: "8:00 AM - 4:00 PM",
        saturday: "9:00 AM - 1:00 PM",
        sunday: "Closed"
      }
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      rating: 4.7,
      reviews: 89,
      location: "Children's Medical Center",
      address: "789 Kids Care St, Pediatric Medical Plaza",
      phone: "+1 (555) 345-6789",
      email: "emily.rodriguez@kidsmedicine.com",
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1594824797147-5cd0b4cf9e67?w=400&h=400&fit=crop&crop=face",
      bio: "Dr. Rodriguez is a compassionate pediatric specialist with extensive experience in children's health, development, and family-centered care.",
      education: ["MD - UCLA", "Residency - Children's Hospital LA", "Fellowship - Pediatric Development"],
      certifications: ["Board Certified in Pediatrics", "Certified in Child Development"],
      languages: ["English", "Spanish"],
      experience: "10+ years",
      consultationFee: "$120",
      hours: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 4:00 PM",
        saturday: "10:00 AM - 2:00 PM",
        sunday: "Closed"
      }
    }
  ];
  
  return doctors.find(d => d.id === parseInt(id));
};

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const doctor = id ? getDoctorById(id) : null;

  if (!doctor) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Doctor Not Found</h1>
          <Link to="/doctors">
            <Button variant="medical">Back to Doctors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/doctors" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Header */}
            <Card className="shadow-medical">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                  />
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
                        <Badge variant="secondary" className="mb-2 text-base px-3 py-1">
                          {doctor.specialty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-medium">{doctor.rating}</span>
                        <span className="text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{doctor.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{doctor.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-secondary" />
                        <span>Languages: {doctor.languages.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{doctor.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Education</h4>
                  <ul className="space-y-1">
                    {doctor.education.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-secondary mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <ul className="space-y-1">
                    {doctor.certifications.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-primary mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(doctor.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between py-2 border-b border-border/50">
                      <span className="font-medium capitalize">{day}</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="shadow-medical sticky top-4">
              <CardHeader>
                <CardTitle className="text-center">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {doctor.consultationFee}
                  </div>
                  <div className="text-sm text-muted-foreground">Consultation Fee</div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button variant="medical" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  
                  <Button variant="healing" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {doctor.phone}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span className="text-sm">{doctor.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-accent mt-0.5" />
                  <span className="text-sm">{doctor.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold text-destructive mb-2">Medical Emergency?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For urgent medical care, call 911 or visit your nearest emergency room.
                  </p>
                  <Button variant="destructive" size="sm" className="w-full">
                    Emergency Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}