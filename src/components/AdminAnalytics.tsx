import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, MessageSquare, Calendar, TrendingUp, TrendingDown, 
  Activity, Clock, Heart, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  totalUsers: number;
  totalDoctors: number;
  totalSessions: number;
  totalAppointments: number;
  avgSessionDuration: number;
  topSymptoms: Array<{ name: string; count: number }>;
  userGrowth: Array<{ date: string; users: number; doctors: number }>;
  sessionActivity: Array<{ hour: number; sessions: number }>;
  urgencyDistribution: Array<{ level: string; count: number; color: string }>;
  specialtyPopularity: Array<{ specialty: string; appointments: number }>;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalDoctors: 0,
    totalSessions: 0,
    totalAppointments: 0,
    avgSessionDuration: 0,
    topSymptoms: [],
    userGrowth: [],
    sessionActivity: [],
    urgencyDistribution: [],
    specialtyPopularity: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      // Fetch data in parallel
      const [
        usersResponse,
        doctorsResponse,
        sessionsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('doctors').select('*'),
        supabase.from('chat_sessions').select('*').gte('created_at', startDate.toISOString()),
        supabase.from('appointments').select('*').gte('created_at', startDate.toISOString()),
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (doctorsResponse.error) throw doctorsResponse.error;
      if (sessionsResponse.error) throw sessionsResponse.error;
      if (appointmentsResponse.error) throw appointmentsResponse.error;

      const users = usersResponse.data || [];
      const doctors = doctorsResponse.data || [];
      const sessions = sessionsResponse.data || [];
      const appointments = appointmentsResponse.data || [];

      // Process analytics data
      const processedAnalytics: AnalyticsData = {
        totalUsers: users.length,
        totalDoctors: doctors.length,
        totalSessions: sessions.length,
        totalAppointments: appointments.length,
        avgSessionDuration: 12, // Mock data - would calculate from actual session data

        // Top symptoms (mock data - would analyze chat content)
        topSymptoms: [
          { name: 'Headache', count: 45 },
          { name: 'Fever', count: 38 },
          { name: 'Fatigue', count: 32 },
          { name: 'Cough', count: 28 },
          { name: 'Stomach Pain', count: 22 },
        ],

        // User growth over time
        userGrowth: generateGrowthData(startDate, endDate, users, doctors),

        // Session activity by hour
        sessionActivity: generateSessionActivity(sessions),

        // Urgency distribution
        urgencyDistribution: [
          { level: 'Low', count: sessions.filter(s => s.urgency_level === 'low').length, color: '#10b981' },
          { level: 'Medium', count: sessions.filter(s => s.urgency_level === 'medium').length, color: '#f59e0b' },
          { level: 'High', count: sessions.filter(s => s.urgency_level === 'high').length, color: '#ef4444' },
        ],

        // Specialty popularity
        specialtyPopularity: generateSpecialtyData(doctors, appointments),
      };

      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateGrowthData = (startDate: Date, endDate: Date, users: any[], doctors: any[]) => {
    const data = [];
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const usersUpToDate = users.filter(u => new Date(u.created_at) <= date).length;
      const doctorsUpToDate = doctors.filter(d => new Date(d.created_at) <= date).length;
      
      data.push({
        date: date.toISOString().split('T')[0],
        users: usersUpToDate,
        doctors: doctorsUpToDate,
      });
    }
    
    return data;
  };

  const generateSessionActivity = (sessions: any[]) => {
    const activity = Array.from({ length: 24 }, (_, hour) => ({ hour, sessions: 0 }));
    
    sessions.forEach(session => {
      const hour = new Date(session.created_at).getHours();
      activity[hour].sessions++;
    });
    
    return activity;
  };

  const generateSpecialtyData = (doctors: any[], appointments: any[]) => {
    const specialties = doctors.reduce((acc, doctor) => {
      const specialty = doctor.specialty || 'General Practice';
      if (!acc[specialty]) acc[specialty] = 0;
      
      const doctorAppointments = appointments.filter(a => a.doctor_id === doctor.id).length;
      acc[specialty] += doctorAppointments;
      
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(specialties).map(([specialty, appointments]) => ({
      specialty,
      appointments: Number(appointments),
    })).sort((a, b) => b.appointments - a.appointments);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform usage and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDoctors}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSessions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +23% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAppointments}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +18% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="urgency">Urgency</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User & Doctor Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                  <Line type="monotone" dataKey="doctors" stroke="#82ca9d" name="Doctors" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Activity by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.sessionActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sessions" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Common Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topSymptoms}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="urgency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Urgency Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.urgencyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.urgencyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.specialtyPopularity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="specialty" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;