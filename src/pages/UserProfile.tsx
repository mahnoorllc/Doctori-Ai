import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useRoleBasedAuth } from '@/hooks/useRoleBasedAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Edit2, 
  Save, 
  Phone, 
  Mail, 
  Calendar,
  Heart,
  Shield,
  Upload,
  X,
  Plus
} from 'lucide-react';

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergency_contact?: string;
  medical_conditions?: string[];
  medications?: string[];
  allergies?: string[];
  photo_url?: string;
  bio?: string;
}

export default function UserProfile() {
  const { user, profile, refetchProfile } = useRoleBasedAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({});
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        age: profile.age || undefined,
        gender: profile.gender || undefined,
        weight: profile.weight ? Number(profile.weight) : undefined,
        height: profile.height ? Number(profile.height) : undefined,
        blood_group: profile.blood_group || undefined,
        emergency_contact: profile.emergency_contact || '',
        medical_conditions: profile.medical_conditions || [],
        medications: profile.medications || [],
        allergies: profile.allergies || [],
        photo_url: profile.photo_url || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'medical_conditions' | 'medications' | 'allergies', value: string) => {
    if (value.trim()) {
      const currentArray = formData[field] || [];
      if (!currentArray.includes(value.trim())) {
        handleInputChange(field, [...currentArray, value.trim()]);
      }
    }
  };

  const removeArrayItem = (field: 'medical_conditions' | 'medications' | 'allergies', index: number) => {
    const currentArray = formData[field] || [];
    handleInputChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          height: formData.height,
          blood_group: formData.blood_group,
          emergency_contact: formData.emergency_contact,
          medical_conditions: formData.medical_conditions,
          medications: formData.medications,
          allergies: formData.allergies,
          photo_url: formData.photo_url,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refetchProfile();
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    const name = formData.name || profile?.name || profile?.email || 'User';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user || !profile) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and health details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
              {profile.role}
            </Badge>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={formData.photo_url} />
                  <AvatarFallback className="text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Photo URL"
                      value={formData.photo_url || ''}
                      onChange={(e) => handleInputChange('photo_url', e.target.value)}
                    />
                    <Input
                      placeholder="Full Name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {formData.name || 'No name set'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {formData.email}
                    </p>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  {formData.age && (
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formData.age} years old</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Health Info */}
            {!isEditing && (
              <Card className="shadow-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Health Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.blood_group && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Blood Group:</span>
                      <Badge variant="outline">{formData.blood_group}</Badge>
                    </div>
                  )}
                  {formData.allergies && formData.allergies.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Allergies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.allergies.slice(0, 3).map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                        {formData.allergies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{formData.allergies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{formData.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{formData.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Age</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
                        placeholder="Age"
                      />
                    ) : (
                      <span className="text-sm mt-1 block">{formData.age || 'Not provided'}</span>
                    )}
                  </div>

                  <div>
                    <Label>Gender</Label>
                    {isEditing ? (
                      <Select value={formData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm mt-1 block capitalize">{formData.gender || 'Not provided'}</span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Weight (kg)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                        placeholder="Weight"
                      />
                    ) : (
                      <span className="text-sm mt-1 block">{formData.weight ? `${formData.weight} kg` : 'Not provided'}</span>
                    )}
                  </div>

                  <div>
                    <Label>Height (cm)</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={formData.height || ''}
                        onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || undefined)}
                        placeholder="Height"
                      />
                    ) : (
                      <span className="text-sm mt-1 block">{formData.height ? `${formData.height} cm` : 'Not provided'}</span>
                    )}
                  </div>

                  <div>
                    <Label>Blood Group</Label>
                    {isEditing ? (
                      <Select value={formData.blood_group || ''} onValueChange={(value) => handleInputChange('blood_group', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-sm mt-1 block">{formData.blood_group || 'Not provided'}</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Emergency Contact</Label>
                  {isEditing ? (
                    <Input
                      value={formData.emergency_contact || ''}
                      onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                      placeholder="Emergency contact number"
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{formData.emergency_contact || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Medical Conditions */}
                <div>
                  <Label>Medical Conditions</Label>
                  <div className="mt-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            placeholder="Add medical condition"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('medical_conditions', newCondition);
                                setNewCondition('');
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              addArrayItem('medical_conditions', newCondition);
                              setNewCondition('');
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(formData.medical_conditions || []).map((condition, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {condition}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeArrayItem('medical_conditions', index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(formData.medical_conditions || []).length > 0 ? (
                          formData.medical_conditions?.map((condition, index) => (
                            <Badge key={index} variant="secondary">{condition}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">None reported</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <Label>Current Medications</Label>
                  <div className="mt-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={newMedication}
                            onChange={(e) => setNewMedication(e.target.value)}
                            placeholder="Add medication"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('medications', newMedication);
                                setNewMedication('');
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              addArrayItem('medications', newMedication);
                              setNewMedication('');
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(formData.medications || []).map((medication, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {medication}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeArrayItem('medications', index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(formData.medications || []).length > 0 ? (
                          formData.medications?.map((medication, index) => (
                            <Badge key={index} variant="outline">{medication}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">None reported</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <Label>Allergies</Label>
                  <div className="mt-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Add allergy"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addArrayItem('allergies', newAllergy);
                                setNewAllergy('');
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              addArrayItem('allergies', newAllergy);
                              setNewAllergy('');
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(formData.allergies || []).map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="flex items-center gap-1">
                              {allergy}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeArrayItem('allergies', index)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(formData.allergies || []).length > 0 ? (
                          formData.allergies?.map((allergy, index) => (
                            <Badge key={index} variant="destructive">{allergy}</Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">None reported</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}