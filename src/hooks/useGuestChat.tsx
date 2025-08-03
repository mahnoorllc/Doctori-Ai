import { useState, useCallback, useEffect } from 'react';
import { analyzeSymptoms, getMedicalDisclaimer } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface GuestMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isUrgent?: boolean;
  metadata?: any;
}

export interface GuestChatState {
  sessionId: string;
  messages: GuestMessage[];
  phase: 'initial' | 'assessment' | 'followup' | 'analysis' | 'summary';
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  specialtyRecommendation: string;
  currentQuestionIndex: number;
  followupAnswers: Record<string, string>;
  isLoading: boolean;
  requiresAuth: boolean;
}

const GUEST_STORAGE_KEY = 'doctori_guest_session';

export const useGuestChat = () => {
  const { toast } = useToast();
  
  const [sessionState, setSessionState] = useState<GuestChatState>({
    sessionId: `guest_${Date.now()}`,
    messages: [],
    phase: 'initial',
    symptoms: [],
    urgencyLevel: 'low',
    specialtyRecommendation: '',
    currentQuestionIndex: 0,
    followupAnswers: {},
    isLoading: false,
    requiresAuth: false
  });

  // Load session from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      try {
        const parsedSession = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        parsedSession.messages = parsedSession.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setSessionState(parsedSession);
      } catch (error) {
        console.error('Error loading guest session:', error);
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (sessionState.messages.length > 0) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(sessionState));
    }
  }, [sessionState]);

  const sendMessage = useCallback(async (content: string) => {
    setSessionState(prev => ({ ...prev, isLoading: true }));

    // Add user message
    const userMessage: GuestMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    try {
      // Call our secure AI chat assistant
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          userMessage: content,
          messages: sessionState.messages,
          sessionContext: {
            phase: sessionState.phase,
            symptoms: sessionState.symptoms,
            urgencyLevel: sessionState.urgencyLevel,
            followupAnswers: sessionState.followupAnswers
          }
        }
      });

      if (error) throw error;

      let aiResponse = data.response;
      let newState = { ...sessionState };

      // Basic symptom analysis for urgency detection
      const analysis = analyzeSymptoms(content);
      if (sessionState.phase === 'initial') {
        newState = {
          ...sessionState,
          phase: 'assessment',
          symptoms: analysis.symptoms,
          urgencyLevel: analysis.urgencyLevel,
          specialtyRecommendation: analysis.specialtyRecommendation,
          currentQuestionIndex: 0
        };
      } else if (sessionState.phase === 'assessment') {
        newState.followupAnswers[sessionState.currentQuestionIndex.toString()] = content;
        newState.currentQuestionIndex = sessionState.currentQuestionIndex + 1;
        
        if (newState.currentQuestionIndex >= 3) {
          newState.phase = 'summary';
          newState.requiresAuth = true;
        }
      }

      const aiMessage: GuestMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        isUrgent: newState.urgencyLevel === 'emergency' || newState.urgencyLevel === 'high'
      };

      setSessionState(prev => ({
        ...newState,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const fallbackMessage: GuestMessage = {
        id: (Date.now() + 1).toString(),
        content: `I'm sorry, I'm having trouble processing your request right now.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call 911 immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`,
        role: 'assistant',
        timestamp: new Date(),
        isUrgent: false
      };

      setSessionState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage],
        isLoading: false
      }));

      toast({
        title: "Connection Issue",
        description: "Unable to connect to AI assistant. Please try again.",
        variant: "destructive"
      });
    }
  }, [sessionState, toast]);

  const initializeChat = useCallback((welcomeMessage: string) => {
    const professionalWelcome = `Hello! I'm Doctor AI, your caring virtual health assistant. 🩺

I'm here to help you understand your symptoms and guide you toward appropriate medical care. Please feel free to describe your symptoms or health concerns in as much detail as you're comfortable sharing.

⚠️ **IMPORTANT EMERGENCY NOTICE**: If you're experiencing a medical emergency (chest pain, difficulty breathing, severe bleeding, etc.), please call 911 immediately or go to your nearest emergency room.

ℹ️ **Medical Disclaimer**: I provide general health information only and am not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.

What brings you here today? I'm listening and ready to help guide you toward the right care. 💙`;

    const welcomeMsg: GuestMessage = {
      id: 'welcome',
      content: professionalWelcome,
      role: 'assistant',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [welcomeMsg]
    }));
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setSessionState({
      sessionId: `guest_${Date.now()}`,
      messages: [],
      phase: 'initial',
      symptoms: [],
      urgencyLevel: 'low',
      specialtyRecommendation: '',
      currentQuestionIndex: 0,
      followupAnswers: {},
      isLoading: false,
      requiresAuth: false
    });
  }, []);

  return {
    sessionState,
    sendMessage,
    initializeChat,
    clearSession
  };
};