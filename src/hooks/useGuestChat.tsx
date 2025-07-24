import { useState, useCallback, useEffect } from 'react';
import { analyzeSymptoms, getMedicalDisclaimer } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';

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

    // Process the message based on current phase
    setTimeout(async () => {
      let aiResponse = '';
      let newState = { ...sessionState };

      if (sessionState.phase === 'initial') {
        // Analyze symptoms
        const analysis = analyzeSymptoms(content);
        const disclaimer = getMedicalDisclaimer(analysis.urgencyLevel);
        
        newState = {
          ...sessionState,
          phase: 'assessment',
          symptoms: analysis.symptoms,
          urgencyLevel: analysis.urgencyLevel,
          specialtyRecommendation: analysis.specialtyRecommendation,
          currentQuestionIndex: 0
        };

        if (analysis.urgencyLevel === 'emergency') {
          aiResponse = `${disclaimer.text}\n\nBased on your symptoms, this could be a medical emergency. Please seek immediate medical attention by calling 911 or going to the nearest emergency room. Do not delay seeking care.`;
        } else if (analysis.urgencyLevel === 'high') {
          aiResponse = `${disclaimer.text}\n\nBased on your symptoms, you should seek urgent medical care. I recommend contacting your healthcare provider immediately or visiting urgent care. Let me ask a few quick questions to better understand your situation:\n\n${analysis.questionsToAsk[0]}`;
        } else {
          aiResponse = `${disclaimer.text}\n\nI understand you're experiencing ${analysis.symptoms.length > 0 ? analysis.symptoms.join(', ') : 'these symptoms'}. To provide better guidance, I need to ask a few questions.\n\n${analysis.questionsToAsk[0]}`;
        }

      } else if (sessionState.phase === 'assessment') {
        // Save follow-up answer
        newState.followupAnswers[sessionState.currentQuestionIndex.toString()] = content;
        
        const analysis = analyzeSymptoms(sessionState.symptoms.join(' '));
        
        if (sessionState.currentQuestionIndex < analysis.questionsToAsk.length - 1) {
          newState.currentQuestionIndex = sessionState.currentQuestionIndex + 1;
          aiResponse = analysis.questionsToAsk[newState.currentQuestionIndex];
        } else {
          newState.phase = 'summary';
          newState.requiresAuth = true;
          aiResponse = 'Thank you for providing that information. Based on our conversation, I\'ve prepared a comprehensive health summary.\n\n📋 **Summary Ready**\n- Main symptoms: ' + newState.symptoms.join(', ') + '\n- Recommended specialty: ' + newState.specialtyRecommendation + '\n- Urgency level: ' + newState.urgencyLevel + '\n\n🔒 **To download a detailed PDF report with doctor visit preparation, you\'ll need to create a free account or log in.**\n\nYou can continue chatting without an account, but PDF downloads require registration for security and medical compliance.';
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

    }, 1500);
  }, [sessionState, toast]);

  const initializeChat = useCallback((welcomeMessage: string) => {
    const welcomeMsg: GuestMessage = {
      id: 'welcome',
      content: welcomeMessage,
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