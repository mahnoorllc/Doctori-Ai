import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Calendar as CalendarIcon, MessageSquare, Settings, Clock, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  status: string;
  urgency_level: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingChats: number;
  monthlyRevenue: number;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingChats: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch doctor's appointments
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id)
        .order('appointment_date', { ascending: true });

      if (appointmentError) throw appointmentError;

      // Fetch chat sessions
      const { data: chatData, error: chatError } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (chatError) throw chatError;

      // Fetch profile data for appointments
      let appointmentsWithProfiles: Appointment[] = [];
      if (appointmentData && appointmentData.length > 0) {
        const userIds = appointmentData.map(apt => apt.user_id);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', userIds);

        appointmentsWithProfiles = appointmentData.map(appointment => ({
          ...appointment,
          profiles: profileData?.find(profile => profile.id === appointment.user_id) || { first_name: '', last_name: '' }
        }));
      }

      // Fetch profile data for chat sessions
      let chatSessionsWithProfiles: ChatSession[] = [];
      if (chatData && chatData.length > 0) {
        const chatUserIds = chatData.map(chat => chat.user_id);
        const { data: chatProfileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', chatUserIds);

        chatSessionsWithProfiles = chatData.map(session => ({
          ...session,
          profiles: chatProfileData?.find(profile => profile.id === session.user_id) || { first_name: '', last_name: '' }
        }));
      }

      setAppointments(appointmentsWithProfiles);
      setChatSessions(chatSessionsWithProfiles);

      // Calculate stats
      const today = moment().format('YYYY-MM-DD');
      const todayAppointments = appointmentData?.filter(apt => 
        moment(apt.appointment_date).format('YYYY-MM-DD') === today
      ).length || 0;

      const uniquePatients = new Set(appointmentData?.map(apt => apt.user_id)).size;
      const pendingChats = chatData?.filter(chat => chat.status === 'active').length || 0;

      setStats({
        totalPatients: uniquePatients,
        todayAppointments,
        pendingChats,
        monthlyRevenue: appointmentData?.length * 150 || 0, // Estimated revenue
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Appointment status updated');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const calendarEvents = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.profiles?.first_name} ${appointment.profiles?.last_name}`,
    start: new Date(appointment.appointment_date),
    end: moment(appointment.appointment_date).add(30, 'minutes').toDate(),
    resource: appointment,
  }));

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your patients and appointments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Unique patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingChats}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="chats">Chat Reports</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Manage your upcoming and past appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">
                          {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {moment(appointment.appointment_date).format('MMM DD, YYYY HH:mm')}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        appointment.status === 'completed' ? 'default' :
                        appointment.status === 'scheduled' ? 'secondary' :
                        appointment.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {appointment.status}
                      </Badge>
                      {appointment.status === 'scheduled' && (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No appointments found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Your patients and their recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.reduce((unique, appointment) => {
                  if (!unique.find(item => item.user_id === appointment.user_id)) {
                    unique.push(appointment);
                  }
                  return unique;
                }, [] as Appointment[]).map((patient) => (
                  <div key={patient.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {patient.profiles?.first_name} {patient.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last appointment: {moment(patient.appointment_date).format('MMM DD, YYYY')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View History
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat Reports</CardTitle>
              <CardDescription>Review patient consultations and chat sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chatSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {session.profiles?.first_name} {session.profiles?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.title || 'Health Consultation'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {moment(session.created_at).format('MMM DD, YYYY HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.urgency_level === 'high' ? 'destructive' : 'secondary'}>
                        {session.urgency_level}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
                {chatSessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No chat sessions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Calendar</CardTitle>
              <CardDescription>Visual overview of your schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  views={['month', 'week', 'day']}
                  defaultView="week"
                  step={30}
                  timeslots={1}
                  min={moment().set({ hour: 8, minute: 0 }).toDate()}
                  max={moment().set({ hour: 18, minute: 0 }).toDate()}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;