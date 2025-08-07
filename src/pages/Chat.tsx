import React, { useState, useEffect } from 'react';
import { IntelligentChatInterface } from '@/components/IntelligentChatInterface';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Chat = () => {
  const { user } = useAuth();
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConsentStatus();
  }, [user]);

  const checkConsentStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('consent_type', 'terms_and_service')
        .order('consented_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking consent:', error);
      }

      setHasConsented(!!data);
    } catch (error) {
      console.error('Error checking consent status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsent = async () => {
    if (!user) return;

    try {
      // Record consent in database
      const { error } = await supabase
        .from('consent_records')
        .insert({
          user_id: user.id,
          consent_type: 'terms_and_service',
          ip_address: '0.0.0.0', // In production, you'd get the real IP
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error recording consent:', error);
      }
      
      setHasConsented(true);
    } catch (error) {
      console.error('Error recording consent:', error);
      // Still allow proceeding even if consent recording fails
      setHasConsented(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Preparing your health consultation</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to use the health assistant</p>
        </div>
      </div>
    );
  }

  // Consent is now handled within the intelligent chat interface
  return <IntelligentChatInterface />;
};

export default Chat;
