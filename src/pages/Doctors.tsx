import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorMap, type Doctor } from "@/components/DoctorMap";
import { MapPin, Star, Clock, Phone, Calendar, Heart, Search } from "lucide-react";
import { Link } from "react-router-dom";

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    reviews: 127,
    location: "Medical Center Downtown",
    address: "123 Health Ave, Downtown Medical District",
    coordinates: [-74.006, 40.7128],
    availability: "Available Today",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    bio: "Dr. Johnson is an experienced cardiologist with over 15 years of expertise in treating heart conditions. She specializes in preventive cardiology and advanced cardiac interventions.",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Practice", 
    rating: 4.9,
    reviews: 203,
    location: "Community Health Clinic",
    address: "456 Wellness Blvd, Community Health Center",
    coordinates: [-74.012, 40.7180],
    availability: "Next Available: Tomorrow",
    phone: "+1 (555) 234-5678",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    bio: "Dr. Chen is a dedicated family medicine physician focused on preventive care, wellness, and comprehensive healthcare for patients of all ages.",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.7,
    reviews: 89,
    location: "Children's Medical Center",
    address: "789 Kids Care St, Pediatric Medical Plaza",
    coordinates: [-74.018, 40.7050],
    availability: "Available Today",
    phone: "+1 (555) 345-6789",
    image: "https://images.unsplash.com/photo-1594824797147-5cd0b4cf9e67?w=400&h=400&fit=crop&crop=face",
    bio: "Dr. Rodriguez is a compassionate pediatric specialist with extensive experience in children's health, development, and family-centered care.",
  },
];

export default function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === "all" || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = ["all", ...Array.from(new Set(doctors.map(d => d.specialty)))];

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Doctor</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Connect with trusted healthcare professionals near you
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input 
                  placeholder="Search by name, specialty, location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty === "all" ? "All Specialties" : specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="today">Available Today</SelectItem>
                  <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 mt-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="medical">
                <Search className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} 
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{doctor.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {doctor.specialty}
                            </Badge>
                            {doctor.availability === "Available Today" && (
                              <Badge className="bg-green-100 text-green-700">🟢 Available Today</Badge>
                            )}
                            {doctor.rating >= 4.8 && (
                              <Badge className="bg-blue-100 text-blue-700">⭐ Top Rated</Badge>
                            )}
                            <Badge className="bg-purple-100 text-purple-700">✅ Verified</Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({doctor.reviews} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">{doctor.bio}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {doctor.availability}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {doctor.phone}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/doctor/${doctor.id}`}>
                          <Button variant="medical" size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </Link>
                        <Button variant="healing" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="map">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DoctorMap 
                  doctors={filteredDoctors} 
                  onDoctorSelect={setSelectedDoctor}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {selectedDoctor ? 'Selected Doctor' : 'Doctors in Area'}
                </h3>
                
                {selectedDoctor ? (
                  <Card className="shadow-medical">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{selectedDoctor.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {selectedDoctor.specialty}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedDoctor.bio}
                      </p>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {selectedDoctor.address}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {selectedDoctor.availability}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link to={`/doctor/${selectedDoctor.id}`}>
                          <Button variant="medical" size="sm" className="w-full">
                            View Full Profile
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="h-3 w-3 mr-1" />
                          Call {selectedDoctor.phone}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {filteredDoctors.slice(0, 3).map(doctor => (
                      <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-shadow cursor-pointer"
                            onClick={() => setSelectedDoctor(doctor)}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2">
                            <img
                              src={doctor.image}
                              alt={doctor.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doctor.name}</p>
                              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}