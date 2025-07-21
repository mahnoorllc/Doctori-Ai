import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    reviews: 127,
    location: "Medical Center Downtown",
    availability: "Available Today",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    bio: "Experienced cardiologist with 15+ years treating heart conditions.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Practice",
    rating: 4.9,
    reviews: 203,
    location: "Community Health Clinic",
    availability: "Next Available: Tomorrow",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    bio: "Family medicine doctor focused on preventive care and wellness.",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.7,
    reviews: 89,
    location: "Children's Medical Center",
    availability: "Available Today",
    image: "https://images.unsplash.com/photo-1594824797147-5cd0b4cf9e67?w=400&h=400&fit=crop&crop=face",
    bio: "Pediatric specialist dedicated to children's health and development.",
  },
];

export default function Doctors() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Doctor</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Connect with trusted healthcare professionals near you
          </p>
          
          <div className="flex gap-4 max-w-md mx-auto">
            <Input placeholder="Search by name, specialty..." className="flex-1" />
            <Button variant="medical">Search</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <Badge variant="secondary" className="mb-2">
                          {doctor.specialty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({doctor.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3">{doctor.bio}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {doctor.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {doctor.availability}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="medical" size="sm">
                        Book Appointment
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}