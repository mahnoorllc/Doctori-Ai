import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'user' | 'provider' | 'admin';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface UserProfile {
  id: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  photo_url?: string;
  phone?: string;
  weight?: number;
  height?: number;
  blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  emergency_contact?: string;
  medical_conditions?: string[];
  medications?: string[];
  allergies?: string[];
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export const useRoleBasedAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToDashboard = () => {
    if (!profile) return;

    switch (profile.role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'provider':
        if (profile.approval_status === 'approved') {
          navigate('/dashboard/provider');
        } else {
          navigate('/dashboard/provider/pending');
        }
        break;
      case 'user':
        navigate('/dashboard/user');
        break;
      default:
        navigate('/');
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const isApproved = (): boolean => {
    return profile?.approval_status === 'approved';
  };

  const canAccessRoute = (requiredRole: UserRole, requireApproval = false): boolean => {
    if (!profile) return false;
    
    const hasCorrectRole = profile.role === requiredRole;
    if (!hasCorrectRole) return false;

    if (requireApproval && profile.role === 'provider') {
      return profile.approval_status === 'approved';
    }

    return true;
  };

  return {
    user,
    profile,
    loading: loading || authLoading,
    redirectToDashboard,
    hasRole,
    isApproved,
    canAccessRoute,
    refetchProfile: fetchUserProfile
  };
};