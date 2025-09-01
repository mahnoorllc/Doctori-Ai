import { useState, useEffect } from 'react';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, UserCheck, Activity, Search, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ActivityLog {
  id: number;
  action: string;
  actor_id: string;
  target_id?: string;
  created_at: string;
  actor_name?: string;
  target_name?: string;
}

export default function AdminDashboard() {
  const { profile } = useRoleBasedAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfiles();
    fetchActivityLogs();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role, approval_status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive"
      });
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          actor_id,
          target_id,
          created_at,
          actor:profiles!activity_logs_actor_id_fkey(name),
          target:profiles!activity_logs_target_id_fkey(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const logs = data?.map(log => ({
        id: log.id,
        action: log.action,
        actor_id: log.actor_id,
        target_id: log.target_id,
        created_at: log.created_at,
        actor_name: log.actor?.name,
        target_name: log.target?.name
      })) || [];

      setActivityLogs(logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const updateProviderStatus = async (userId: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: status })
        .eq('id', userId);

      if (error) throw error;

      // Log the action
      await supabase
        .from('activity_logs')
        .insert({
          actor_id: profile?.id,
          action: `provider_${status}`,
          target_id: userId
        });

      toast({
        title: "Status updated",
        description: `Provider has been ${status}`,
      });

      fetchProfiles();
      fetchActivityLogs();
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || profile.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: profiles.filter(p => p.role === 'user').length,
    totalProviders: profiles.filter(p => p.role === 'provider').length,
    pendingApprovals: profiles.filter(p => p.role === 'provider' && p.approval_status === 'pending').length,
    approvedProviders: profiles.filter(p => p.role === 'provider' && p.approval_status === 'approved').length
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, providers, and system settings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Providers</p>
                  <p className="text-2xl font-bold">{stats.totalProviders}</p>
                </div>
                <UserCheck className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Providers</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedProviders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users & Providers
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and provider approvals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role-filter">Role Filter</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">Users</SelectItem>
                        <SelectItem value="provider">Providers</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredProfiles.map((userProfile) => (
                    <Card key={userProfile.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{userProfile.name || 'No name'}</h3>
                              <Badge variant={
                                userProfile.role === 'admin' ? 'default' :
                                userProfile.role === 'provider' ? 'secondary' : 'outline'
                              }>
                                {userProfile.role}
                              </Badge>
                              {userProfile.role === 'provider' && (
                                <Badge variant={
                                  userProfile.approval_status === 'approved' ? 'default' :
                                  userProfile.approval_status === 'rejected' ? 'destructive' : 'secondary'
                                }>
                                  {userProfile.approval_status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(userProfile.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          {userProfile.role === 'provider' && userProfile.approval_status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => updateProviderStatus(userProfile.id, 'approved')}
                                disabled={loading}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateProviderStatus(userProfile.id, 'rejected')}
                                disabled={loading}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Logs
                </CardTitle>
                <CardDescription>
                  View recent administrative actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {log.actor_name} {log.action.replace('_', ' ')} {log.target_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline">{log.action}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}