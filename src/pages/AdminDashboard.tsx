import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Users, Shield, FileText, BarChart3, Settings, Database, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminAnalytics from "@/components/AdminAnalytics";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  pendingVerifications: number;
  activeSessions: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDoctors: 0,
    pendingVerifications: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchAdminStats();
    }
  }, [user, navigate]);

  const fetchAdminStats = async () => {
    try {
      const [usersRes, doctorsRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('doctors').select('*'),
        supabase.from('chat_sessions').select('*').eq('status', 'active'),
      ]);

      if (usersRes.error) throw usersRes.error;
      if (doctorsRes.error) throw doctorsRes.error;
      if (sessionsRes.error) throw sessionsRes.error;

      const pendingVerifications = doctorsRes.data?.filter(d => !d.verified).length || 0;

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalDoctors: doctorsRes.data?.length || 0,
        pendingVerifications,
        activeSessions: sessionsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage platform users and content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage users and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Users</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Doctor Verification
            </CardTitle>
            <CardDescription>Verify doctor credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Verify Doctors</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>Manage health articles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Content</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>View platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;