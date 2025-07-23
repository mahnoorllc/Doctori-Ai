import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { analyzeSymptoms, getMedicalDisclaimer, generateDoctorVisitPreparation } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';

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
}

export const useChatSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sessionState, setSessionState] = useState<ChatSessionState>({
    sessionId: null,
    messages: [],
    phase: 'initial',
    symptoms: [],
    urgencyLevel: 'low',
    specialtyRecommendation: '',
    currentQuestionIndex: 0,
    followupAnswers: {},
    isLoading: false
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
          aiResponse = `${disclaimer.text}\n\nBased on your symptoms, you should seek urgent medical care. I recommend contacting your healthcare provider immediately or visiting urgent care. Let me ask a few quick questions to better understand your situation: ${analysis.questionsToAsk[0]}`;
        } else {
          aiResponse = `${disclaimer.text}\n\nI understand you're experiencing ${analysis.symptoms.length > 0 ? analysis.symptoms.join(', ') : 'these symptoms'}. To provide better guidance, I need to ask a few questions. ${analysis.questionsToAsk[0]}`;
        }

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
        // Save follow-up answer
        newState.followupAnswers[sessionState.currentQuestionIndex.toString()] = content;
        
        const analysis = analyzeSymptoms(sessionState.symptoms.join(' '));
        
        if (sessionState.currentQuestionIndex < analysis.questionsToAsk.length - 1) {
          newState.currentQuestionIndex = sessionState.currentQuestionIndex + 1;
          aiResponse = analysis.questionsToAsk[newState.currentQuestionIndex];
        } else {
          newState.phase = 'analysis';
          aiResponse = 'Thank you for providing that information. Let me analyze your symptoms and prepare a comprehensive summary with recommendations...';
          
          // Generate assessment
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
        isLoading: false
      }));

      // Save AI message
      await saveMessage(aiResponse, 'assistant', { urgencyLevel: newState.urgencyLevel });
    }, 1500);
  }, [user, sessionState, createSession, saveMessage, toast]);

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
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: "Hello! I'm Doctori AI, your personal health assistant. I'm here to help you understand your symptoms and connect you with the right healthcare providers. Please describe your symptoms or health concerns in detail.\n\n⚠️ Remember: This is not medical advice and should not replace professional medical care. In case of emergency, please call 911 immediately.",
      role: 'assistant',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [welcomeMessage]
    }));
  }, []);

  return {
    sessionState,
    sendMessage,
    initializeChat
  };
};