import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { analyzeSymptoms } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isUrgent?: boolean;
  messageType?: 'text' | 'age_collection' | 'gender_collection' | 'emergency_notice' | 'consent' | 'summary';
  metadata?: any;
}

export interface UserData {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  mainSymptom?: string;
  symptomDuration?: string;
  symptomLocation?: string;
  symptomDescription?: string;
  severityScale?: number;
  triggeringFactors?: string;
  otherSymptoms?: string;
  injuryHistory?: string;
  chronicConditions?: string;
  medications?: string;
  allergies?: string;
  concerns?: string;
}

export interface ChatFlowState {
  sessionId: string | null;
  messages: ChatMessage[];
  phase: 'welcome' | 'emergency_check' | 'consent' | 'symptom_gathering' | 'age_gender' | 'dynamic_questions' | 'summary';
  hasConsented: boolean;
  userData: UserData;
  detectedSymptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  dynamicQuestions: string[];
  currentQuestionIndex: number;
  isLoading: boolean;
}

export const useDoctorAIFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<ChatFlowState>({
    sessionId: null,
    messages: [],
    phase: 'welcome',
    hasConsented: false,
    userData: {},
    detectedSymptoms: [],
    urgencyLevel: 'low',
    dynamicQuestions: [],
    currentQuestionIndex: 0,
    isLoading: false
  });

  const createSession = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: user.id,
          title: 'Doctor AI Consultation',
          status: 'active',
          urgency_level: 'low'
        }])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }, [user]);

  const saveMessage = useCallback(async (content: string, role: 'user' | 'assistant', metadata?: any) => {
    if (!state.sessionId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: state.sessionId,
          content,
          role,
          metadata
        }]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [state.sessionId]);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', messageType?: string, metadata?: any) => {
    const message: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      content,
      role,
      timestamp: new Date(),
      messageType: messageType as any,
      metadata
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    return message;
  }, []);

  const generateDynamicQuestions = useCallback((symptoms: string[], urgencyLevel: string) => {
    const baseQuestions = [
      "How long have you been experiencing this symptom?",
      "Where exactly is the symptom located?",
      "How would you describe the symptom? For example: sharp, dull, burning, throbbing, or something else?",
      "On a scale of 0 to 10, how severe is the symptom right now?",
      "Does anything make the symptom better or worse?",
      "Have you noticed any other symptoms like swelling, redness, numbness, tingling, weakness, or difficulty moving the affected area?"
    ];

    const contextualQuestions = [];

    // Add symptom-specific questions
    if (symptoms.some(s => s.includes('pain'))) {
      contextualQuestions.push("Does the pain radiate to other areas?");
    }
    
    if (symptoms.some(s => s.includes('headache'))) {
      contextualQuestions.push("Do you experience sensitivity to light or sound?");
    }

    if (symptoms.some(s => s.includes('stomach') || s.includes('abdominal'))) {
      contextualQuestions.push("Are you experiencing nausea or vomiting?");
    }

    if (urgencyLevel === 'high' || urgencyLevel === 'emergency') {
      contextualQuestions.push("Have you had any recent injuries or trauma?");
    }

    // Standard follow-up questions
    const standardQuestions = [
      "Have you had any recent injuries or prior episodes like this?",
      "Do you have any chronic medical conditions?",
      "Are you currently taking any medications, supplements, or vitamins?",
      "Do you have any allergies to medications, foods, or other substances?",
      "Is there anything specific you are worried about or hoping to achieve with this consultation?"
    ];

    return [...baseQuestions, ...contextualQuestions, ...standardQuestions];
  }, []);

  const processUserMessage = useCallback(async (content: string) => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true }));

    // Create session if needed
    let sessionId = state.sessionId;
    if (!sessionId) {
      sessionId = await createSession();
      if (!sessionId) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      setState(prev => ({ ...prev, sessionId }));
    }

    // Add user message
    addMessage(content, 'user');
    await saveMessage(content, 'user');

    // Process based on current phase
    switch (state.phase) {
      case 'welcome':
        // Show emergency notice
        addMessage("⚠️ If this is an emergency, call 911 or your local emergency number immediately.", 'assistant', 'emergency_notice');
        
        // Show consent requirement
        setTimeout(() => {
          addMessage("Before we continue, I need your consent:", 'assistant', 'consent');
        }, 1000);
        
        setState(prev => ({ ...prev, phase: 'consent', isLoading: false }));
        break;

      case 'consent':
        if (content.toLowerCase().includes('agree') || content.toLowerCase().includes('yes')) {
          setState(prev => ({ ...prev, hasConsented: true, phase: 'symptom_gathering' }));
          addMessage("Thank you for your consent. Hello! How can I assist you with your health today? Are you experiencing a new symptom, have a question about a known condition, or is there something specific you'd like to discuss?", 'assistant');
        } else {
          addMessage("I understand you need to think about this. Please let me know when you're ready to consent to continue.", 'assistant');
        }
        setState(prev => ({ ...prev, isLoading: false }));
        break;

      case 'symptom_gathering':
        // Analyze symptoms
        const analysis = analyzeSymptoms(content);
        setState(prev => ({
          ...prev,
          userData: { ...prev.userData, mainSymptom: content },
          detectedSymptoms: analysis.symptoms,
          urgencyLevel: analysis.urgencyLevel,
          dynamicQuestions: generateDynamicQuestions(analysis.symptoms, analysis.urgencyLevel),
          phase: 'age_gender'
        }));

        // Update session in database
        if (sessionId) {
          await supabase
            .from('chat_sessions')
            .update({
              urgency_level: analysis.urgencyLevel,
              primary_symptoms: analysis.symptoms
            })
            .eq('id', sessionId);
        }

        // Show urgency warning if needed
        if (analysis.urgencyLevel === 'emergency') {
          addMessage("🚨 MEDICAL EMERGENCY: Based on your symptoms, you may need immediate medical attention. Please call 911 or go to your nearest emergency room immediately.", 'assistant', 'emergency_notice');
        } else if (analysis.urgencyLevel === 'high') {
          addMessage("⚠️ URGENT: Your symptoms may require prompt medical attention. Please consider seeking medical care soon.", 'assistant', 'emergency_notice');
        }

        // Ask for age and gender
        setTimeout(() => {
          addMessage("Thank you for sharing that information. To better personalize my questions, could you please tell me your age?", 'assistant', 'age_collection');
        }, 2000);

        setState(prev => ({ ...prev, isLoading: false }));
        break;

      case 'age_gender':
        if (!state.userData.age && /\d+/.test(content)) {
          const age = parseInt(content.match(/\d+/)?.[0] || '0');
          setState(prev => ({
            ...prev,
            userData: { ...prev.userData, age }
          }));
          addMessage(`Thank you. And could you please tell me your biological sex (male, female, or other)?`, 'assistant', 'gender_collection');
        } else if (!state.userData.gender) {
          const gender = content.toLowerCase().includes('male') ? 'male' : 
                       content.toLowerCase().includes('female') ? 'female' : 'other';
          setState(prev => ({
            ...prev,
            userData: { ...prev.userData, gender: gender as any },
            phase: 'dynamic_questions',
            currentQuestionIndex: 0
          }));
          
          // Start dynamic questioning
          setTimeout(() => {
            const firstQuestion = state.dynamicQuestions[0];
            if (firstQuestion) {
              addMessage(firstQuestion, 'assistant');
            }
          }, 1000);
        }
        setState(prev => ({ ...prev, isLoading: false }));
        break;

      case 'dynamic_questions':
        // Store the answer and move to next question
        const currentIndex = state.currentQuestionIndex;
        const questionKeys = ['symptomDuration', 'symptomLocation', 'symptomDescription', 'severityScale', 'triggeringFactors', 'otherSymptoms', 'injuryHistory', 'chronicConditions', 'medications', 'allergies', 'concerns'];
        
        if (currentIndex < questionKeys.length) {
          const key = questionKeys[currentIndex] as keyof UserData;
          setState(prev => ({
            ...prev,
            userData: { ...prev.userData, [key]: content },
            currentQuestionIndex: currentIndex + 1
          }));

          // Ask next question or generate summary
          if (currentIndex + 1 < state.dynamicQuestions.length) {
            setTimeout(() => {
              const nextQuestion = state.dynamicQuestions[currentIndex + 1];
              if (nextQuestion) {
                addMessage(nextQuestion, 'assistant');
              }
            }, 1000);
          } else {
            // Generate summary
            setState(prev => ({ ...prev, phase: 'summary' }));
            setTimeout(() => {
              generateSummary();
            }, 2000);
          }
        }
        setState(prev => ({ ...prev, isLoading: false }));
        break;
    }
  }, [state, user, createSession, addMessage, saveMessage, generateDynamicQuestions]);

  const generateSummary = useCallback(async () => {
    const summaryContent = `## AI Consult Summary

- **Main symptom**: ${state.userData.mainSymptom || 'Not specified'}
- **Age**: ${state.userData.age || 'Not specified'}
- **Biological sex**: ${state.userData.gender || 'Not specified'}
- **Symptom duration**: ${state.userData.symptomDuration || 'Not specified'}
- **Location**: ${state.userData.symptomLocation || 'Not specified'}
- **Symptom description**: ${state.userData.symptomDescription || 'Not specified'}
- **Severity (0-10)**: ${state.userData.severityScale || 'Not specified'}
- **Factors affecting symptom**: ${state.userData.triggeringFactors || 'Not specified'}
- **Other symptoms**: ${state.userData.otherSymptoms || 'Not specified'}
- **Injury history**: ${state.userData.injuryHistory || 'Not specified'}
- **Chronic conditions**: ${state.userData.chronicConditions || 'Not specified'}
- **Medications**: ${state.userData.medications || 'Not specified'}
- **Allergies**: ${state.userData.allergies || 'Not specified'}
- **Patient concerns**: ${state.userData.concerns || 'Not specified'}

---

**Doctor AI is not a licensed medical provider and does not provide medical advice. Always consult a healthcare professional for diagnosis and treatment.**`;

    addMessage(summaryContent, 'assistant', 'summary');
    
    // Save complete consultation data
    if (state.sessionId) {
      try {
        await supabase
          .from('medical_assessments')
          .insert([{
            session_id: state.sessionId,
            symptoms: { detected: state.detectedSymptoms } as any,
            assessment_data: state.userData as any,
            urgency_score: state.urgencyLevel === 'emergency' ? 100 : 
                          state.urgencyLevel === 'high' ? 80 :
                          state.urgencyLevel === 'medium' ? 50 : 20
          }]);
      } catch (error) {
        console.error('Error saving assessment:', error);
      }
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
  }, [state, addMessage]);

  const initializeChat = useCallback(() => {
    const welcomeMessage = `I'm your private and personal AI doctor. As an AI doctor, my service is fast and free. After we chat, if you want, you can have a video visit with a top doctor for only $39. What can I help you with today?`;
    
    addMessage(welcomeMessage, 'assistant');
    setState(prev => ({ ...prev, phase: 'welcome' }));
  }, [addMessage]);

  const handleConsent = useCallback(() => {
    setState(prev => ({ ...prev, hasConsented: true, phase: 'symptom_gathering' }));
    addMessage("Thank you for your consent. Hello! How can I assist you with your health today? Are you experiencing a new symptom, have a question about a known condition, or is there something specific you'd like to discuss?", 'assistant');
  }, [addMessage]);

  return {
    state,
    processUserMessage,
    initializeChat,
    handleConsent
  };
};