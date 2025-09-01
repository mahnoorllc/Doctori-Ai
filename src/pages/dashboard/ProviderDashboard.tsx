import { useState, useEffect } from 'react';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Users, FileText, User, Upload } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
}

export default function ProviderDashboard() {
  const { profile, refetchProfile } = useRoleBasedAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    specialty: '',
    experience: '',
    license_number: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchProviderData();
      fetchPatients();
    }
  }, [profile]);

  const fetchProviderData = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', profile?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfileData({
          name: profile?.name || '',
          bio: data.bio || '',
          specialty: data.specialty || '',
          experience: data.experience?.toString() || '',
          license_number: data.license_number || ''
        });
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_patient_assignments')
        .select(`
          patient_id,
          profiles!provider_patient_assignments_patient_id_fkey (
            id,
            name,
            email,
            age,
            gender
          )
        `)
        .eq('provider_id', profile?.id);

      if (error) throw error;

      const patientList = data?.map(assignment => ({
        id: assignment.profiles?.id || '',
        name: assignment.profiles?.name || '',
        email: assignment.profiles?.email || '',
        age: assignment.profiles?.age,
        gender: assignment.profiles?.gender
      })) || [];

      setPatients(patientList);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patient assignments",
        variant: "destructive"
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: profileData.name })
        .eq('id', profile?.id);

      if (profileError) throw profileError;

      // Upsert doctors table
      const { error: doctorError } = await supabase
        .from('doctors')
        .upsert({
          user_id: profile?.id,
          bio: profileData.bio,
          specialty: profileData.specialty,
          experience: profileData.experience ? parseInt(profileData.experience) : 0,
          license_number: profileData.license_number
        });

      if (doctorError) throw doctorError;

      toast({
        title: "Profile updated",
        description: "Your provider profile has been updated successfully.",
      });
      
      refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your practice and connect with patients
          </p>
          {profile?.approval_status === 'approved' && (
            <Badge variant="default" className="mt-2">
              ✓ Verified Provider
            </Badge>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="patients">
              <Users className="w-4 h-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Provider Information
                </CardTitle>
                <CardDescription>
                  Update your professional profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Input
                        id="specialty"
                        value={profileData.specialty}
                        onChange={(e) => setProfileData(prev => ({ ...prev, specialty: e.target.value }))}
                        placeholder="e.g., Internal Medicine"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="Years of practice"
                        min="0"
                        max="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        value={profileData.license_number}
                        onChange={(e) => setProfileData(prev => ({ ...prev, license_number: e.target.value }))}
                        placeholder="Medical license number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Describe your experience, specializations, and approach to patient care..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Patients
                </CardTitle>
                <CardDescription>
                  View and manage your patient assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No patients assigned</h3>
                    <p className="text-muted-foreground">
                      Patient assignments will appear here once an admin assigns them to you
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {patients.map((patient) => (
                      <Card key={patient.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-semibold">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">{patient.email}</p>
                              <div className="flex gap-2">
                                {patient.age && (
                                  <Badge variant="secondary">Age: {patient.age}</Badge>
                                )}
                                {patient.gender && (
                                  <Badge variant="secondary">{patient.gender}</Badge>
                                )}
                              </div>
                            </div>
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Professional Documents
                </CardTitle>
                <CardDescription>
                  Upload and manage your professional credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Document management</h3>
                  <p className="text-muted-foreground">
                    Coming soon - Upload licenses, certifications, and other professional documents
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}