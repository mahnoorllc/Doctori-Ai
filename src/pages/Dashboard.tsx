import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Calendar, 
  Heart, 
  BookOpen, 
  User, 
  Settings,
  Phone,
  MapPin,
  Clock,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const savedChats = [
  {
    id: 1,
    title: "Headache and fever symptoms",
    date: "2024-01-20",
    preview: "I've been experiencing headaches and mild fever...",
    recommendation: "Consider seeing a general practitioner"
  },
  {
    id: 2,
    title: "Back pain consultation",
    date: "2024-01-18",
    preview: "Lower back pain after exercise...",
    recommendation: "Recommended orthopedic specialist"
  },
  {
    id: 3,
    title: "Nutrition advice",
    date: "2024-01-15",
    preview: "Questions about healthy diet plans...",
    recommendation: "Contact nutritionist Dr. Smith"
  }
];

const savedDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
    nextAvailable: "Today at 3:00 PM"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "General Practice",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
    nextAvailable: "Tomorrow at 10:00 AM"
  }
];

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "Cardiology Consultation",
    date: "2024-01-25",
    time: "2:00 PM",
    type: "In-person",
    location: "Medical Center Downtown"
  },
  {
    id: 2,
    doctor: "Dr. Emily Rodriguez",
    specialty: "Annual Checkup",
    date: "2024-02-02",
    time: "10:30 AM",
    type: "Virtual",
    location: "Video Call"
  }
];

export default function Dashboard() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John!</h1>
            <p className="text-muted-foreground">
              Manage your health journey and stay connected with your care team
            </p>
          </div>
          <Button variant="medical">
            <MessageCircle className="mr-2 h-4 w-4" />
            Start New Chat
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-primary p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{savedChats.length}</div>
              <div className="text-sm text-muted-foreground">Saved Chats</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-healing p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{savedDoctors.length}</div>
              <div className="text-sm text-muted-foreground">Saved Doctors</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-to-br from-accent to-accent/80 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <div className="text-sm text-muted-foreground">Appointments</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="bg-gradient-primary p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Articles Read</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chats">Chat History</TabsTrigger>
            <TabsTrigger value="doctors">Saved Doctors</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Upcoming Appointments */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{appointment.doctor}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {appointment.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="medical" size="sm">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Chats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Recent Health Chats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedChats.slice(0, 2).map((chat) => (
                  <div key={chat.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{chat.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(chat.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{chat.preview}</p>
                    <Badge variant="secondary" className="text-xs">
                      {chat.recommendation}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Chat History
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chats" className="space-y-4 mt-6">
            {savedChats.map((chat) => (
              <Card key={chat.id} className="shadow-card hover:shadow-medical transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">{chat.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(chat.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{chat.preview}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{chat.recommendation}</Badge>
                    <Button variant="outline" size="sm">
                      Continue Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="doctors" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {savedDoctors.map((doctor) => (
                <Card key={doctor.id} className="shadow-card hover:shadow-medical transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <Badge variant="secondary" className="mb-2">{doctor.specialty}</Badge>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {doctor.rating}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {doctor.nextAvailable}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/doctor/${doctor.id}`}>
                          <Button variant="medical" size="sm">
                            Book Appointment
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">John Doe</h3>
                  <p className="text-muted-foreground">john.doe@email.com</p>
                </div>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Edit Personal Information
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="mr-2 h-4 w-4" />
                    Health Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}