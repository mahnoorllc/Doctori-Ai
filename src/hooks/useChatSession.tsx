
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { analyzeSymptoms, getMedicalDisclaimer, generateDoctorVisitPreparation } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isUrgent?: boolean;
  metadata?: any;
}

export interface ChatSessionState {
  sessionId: string | null;
  messages: ChatMessage[];
  phase: 'initial' | 'assessment' | 'followup' | 'analysis' | 'summary';
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  specialtyRecommendation: string;
  currentQuestionIndex: number;
  followupAnswers: Record<string, string>;
  isLoading: boolean;
  retryCount: number;
}

const MAX_RETRIES = 2;

export const useChatSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [sessionState, setSessionState] = useState<ChatSessionState>({
    sessionId: null,
    messages: [],
    phase: 'initial',
    symptoms: [],
    urgencyLevel: 'low',
    specialtyRecommendation: '',
    currentQuestionIndex: 0,
    followupAnswers: {},
    isLoading: false,
    retryCount: 0
  });

  const createSession = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: user.id,
          title: 'Health Consultation',
          status: 'active',
          urgency_level: 'low'
        }])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create chat session. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [user, toast]);

  const saveMessage = useCallback(async (content: string, role: 'user' | 'assistant', metadata?: any) => {
    if (!sessionState.sessionId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionState.sessionId,
          content,
          role,
          metadata
        }]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [sessionState.sessionId]);

  const sendMessageWithRetry = useCallback(async (content: string, sessionId: string, retryCount = 0): Promise<void> => {
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
            followupAnswers: sessionState.followupAnswers,
            sessionId: sessionId,
            language: language
          }
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to connect to AI service');
      }

      if (!data?.response) {
        console.error('Invalid response from AI service:', data);
        throw new Error('No response received from AI');
      }

      let aiResponse = data.response;
      let newState = { ...sessionState };

      // Basic symptom analysis for urgency detection and database updates
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

        // Update session in database
        await supabase
          .from('chat_sessions')
          .update({
            urgency_level: analysis.urgencyLevel,
            primary_symptoms: analysis.symptoms,
            specialty_recommendation: analysis.specialtyRecommendation
          })
          .eq('id', sessionId);

      } else if (sessionState.phase === 'assessment') {
        newState.followupAnswers[sessionState.currentQuestionIndex.toString()] = content;
        newState.currentQuestionIndex = sessionState.currentQuestionIndex + 1;
        
        if (newState.currentQuestionIndex >= 3) {
          newState.phase = 'analysis';
          // Generate comprehensive assessment after getting enough info
          setTimeout(() => {
            generateAssessment(newState);
          }, 2000);
        }
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        isUrgent: newState.urgencyLevel === 'emergency' || newState.urgencyLevel === 'high'
      };

      setSessionState(prev => ({
        ...newState,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
        retryCount: 0 // Reset retry count on success
      }));

      // Save AI message
      await saveMessage(aiResponse, 'assistant', { urgencyLevel: newState.urgencyLevel });

      // Removed detailed logging for privacy

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Check if it's a rate limit error and we can retry
      if ((error.message?.includes('rate limit') || error.message?.includes('Rate limit')) && retryCount < MAX_RETRIES) {
        console.log(`Rate limit hit, retrying in ${(retryCount + 1) * 3} seconds...`);
        
        toast({
          title: "High Traffic",
          description: `Server is busy, retrying in ${(retryCount + 1) * 3} seconds...`,
          variant: "default"
        });

        // Wait with exponential backoff
        setTimeout(() => {
          sendMessageWithRetry(content, sessionId, retryCount + 1);
        }, (retryCount + 1) * 3000);
        
        return;
      }
      
      // Fallback response
      const emergencyNumber = language === 'bn' ? '999' : '911';
      const isRateLimit = error.message?.includes('rate limit') || error.message?.includes('Rate limit');
      
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: isRateLimit 
          ? `I'm experiencing high demand right now. Please try again in a moment.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`
          : `I'm sorry, I'm having trouble processing your request right now.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`,
        role: 'assistant',
        timestamp: new Date(),
        isUrgent: false
      };

      setSessionState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage],
        isLoading: false,
        retryCount: retryCount
      }));

      toast({
        title: isRateLimit ? "Server Busy" : "Connection Issue",
        description: isRateLimit 
          ? "High demand detected. Please try again shortly." 
          : "Unable to connect to AI assistant. Please try again.",
        variant: "destructive"
      });
    }
  }, [sessionState, saveMessage, toast, language]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a chat session.",
        variant: "destructive"
      });
      return;
    }

    setSessionState(prev => ({ ...prev, isLoading: true }));

    // Create session if it doesn't exist
    let sessionId = sessionState.sessionId;
    if (!sessionId) {
      sessionId = await createSession();
      if (!sessionId) {
        setSessionState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      setSessionState(prev => ({ ...prev, sessionId }));
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    // Save user message
    await saveMessage(content, 'user');

    await sendMessageWithRetry(content, sessionId, 0);
  }, [user, sessionState, createSession, saveMessage, sendMessageWithRetry]);

  const generateAssessment = useCallback(async (state: ChatSessionState) => {
    if (!state.sessionId) return;

    try {
      // Create medical assessment
      const assessmentData = {
        symptoms: state.symptoms,
        urgency_level: state.urgencyLevel,
        specialty_recommendation: state.specialtyRecommendation,
        responses: state.followupAnswers
      };

      await supabase
        .from('medical_assessments')
        .insert([{
          session_id: state.sessionId,
          symptoms: { detected: state.symptoms },
          assessment_data: assessmentData,
          urgency_score: state.urgencyLevel === 'emergency' ? 100 : 
                        state.urgencyLevel === 'high' ? 80 :
                        state.urgencyLevel === 'medium' ? 50 : 20
        }]);

      // Generate visit preparation
      const preparation = generateDoctorVisitPreparation(
        state.symptoms, 
        state.followupAnswers, 
        state.urgencyLevel
      );

      await supabase
        .from('visit_preparations')
        .insert([{
          user_id: user?.id,
          session_id: state.sessionId,
          summary: preparation.summary,
          questions: preparation.questionsForDoctor,
          symptoms_timeline: preparation.symptomsTimeline,
          medications_to_discuss: preparation.medicationsToDiscuss
        }]);

      const summaryMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: `Based on our conversation, I've prepared a comprehensive health summary and doctor visit preparation guide. This includes your symptom analysis, recommended specialty (${state.specialtyRecommendation}), and questions to ask your healthcare provider.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setSessionState(prev => ({
        ...prev,
        messages: [...prev.messages, summaryMessage],
        phase: 'summary'
      }));

      await saveMessage(summaryMessage.content, 'assistant');

    } catch (error) {
      console.error('Error generating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to generate assessment. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const initializeChat = useCallback(() => {
    const emergencyNumber = language === 'bn' ? '999' : '911';
    const professionalWelcome = `Hello! I'm Doctor AI, your caring virtual health assistant. 🩺

Welcome to your personalized health consultation. I'm here to help you understand your symptoms and guide you toward appropriate medical care. Please feel free to describe your symptoms or health concerns in as much detail as you're comfortable sharing.

⚠️ **IMPORTANT EMERGENCY NOTICE**: If you're experiencing a medical emergency (chest pain, difficulty breathing, severe bleeding, etc.), please call ${emergencyNumber} immediately or go to your nearest emergency room.

ℹ️ **Medical Disclaimer**: I provide general health information only and am not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.

As a registered user, I'll be able to save our conversation and provide you with a comprehensive health summary and doctor visit preparation guide. What brings you here today? I'm listening and ready to help guide you toward the right care. 💙`;

    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: professionalWelcome,
      role: 'assistant',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [welcomeMessage]
    }));
  }, [language]);

  return {
    sessionState,
    sendMessage,
    initializeChat
  };
};
