import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface QuestionStep {
  id: string;
  question: string;
  type: 'text' | 'select' | 'number';
  options?: string[];
  required: boolean;
  field: string;
}

interface ChatAnswers {
  age?: number;
  gender?: string;
  mainSymptom?: string;
  duration?: string;
  severity?: string;
  additionalSymptoms?: string;
  medications?: string;
  allergies?: string;
  medicalHistory?: string;
}

const QUESTIONS: QuestionStep[] = [
  {
    id: 'age',
    question: 'What is your age?',
    type: 'number',
    required: true,
    field: 'age'
  },
  {
    id: 'gender',
    question: 'What is your gender?',
    type: 'select',
    options: ['male', 'female', 'other', 'prefer_not_to_say'],
    required: true,
    field: 'gender'
  },
  {
    id: 'mainSymptom',
    question: 'What is your main health concern or symptom?',
    type: 'text',
    required: true,
    field: 'mainSymptom'
  },
  {
    id: 'duration',
    question: 'How long have you been experiencing this symptom?',
    type: 'select',
    options: ['Less than 24 hours', '1-3 days', '4-7 days', '1-2 weeks', '2-4 weeks', 'More than a month'],
    required: true,
    field: 'duration'
  },
  {
    id: 'severity',
    question: 'On a scale of 1-10, how would you rate the severity of your symptom?',
    type: 'select',
    options: ['1 - Very mild', '2', '3', '4', '5 - Moderate', '6', '7', '8', '9', '10 - Severe'],
    required: true,
    field: 'severity'
  },
  {
    id: 'additionalSymptoms',
    question: 'Do you have any additional symptoms? Please describe them.',
    type: 'text',
    required: false,
    field: 'additionalSymptoms'
  },
  {
    id: 'medications',
    question: 'Are you currently taking any medications?',
    type: 'text',
    required: false,
    field: 'medications'
  },
  {
    id: 'allergies',
    question: 'Do you have any known allergies?',
    type: 'text',
    required: false,
    field: 'allergies'
  }
];

export const useStructuredChat = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<ChatAnswers>({});
  const [chatId, setChatId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createChatSession = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          answers: {},
          age: null,
          gender: null
        })
        .select()
        .single();

      if (error) throw error;
      setChatId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Error",
        description: "Failed to start chat session. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [user]);

  const updateAnswer = useCallback(async (field: string, value: any) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    if (chatId && user) {
      try {
        const updateData: any = {
          answers: newAnswers
        };

        // Update specific fields for age and gender
        if (field === 'age') updateData.age = value;
        if (field === 'gender') updateData.gender = value;

        const { error } = await supabase
          .from('chats')
          .update(updateData)
          .eq('id', chatId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating chat:', error);
        toast({
          title: "Error",
          description: "Failed to save your answer. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [answers, chatId, user]);

  const nextStep = useCallback(async () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the chat
      setIsLoading(true);
      try {
        if (chatId) {
        const { error } = await supabase
          .from('chats')
          .update({
            completed_at: new Date().toISOString(),
            answers: answers as any
          })
          .eq('id', chatId);

          if (error) throw error;
        }
        setIsCompleted(true);
        toast({
          title: "Chat Completed",
          description: "Thank you for completing the health assessment.",
        });
      } catch (error) {
        console.error('Error completing chat:', error);
        toast({
          title: "Error",
          description: "Failed to complete the chat. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentStep, answers, chatId]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setChatId(null);
    setIsCompleted(false);
    setIsLoading(false);
  }, []);

  const getCurrentQuestion = useCallback(() => {
    return QUESTIONS[currentStep];
  }, [currentStep]);

  const isCurrentStepValid = useCallback(() => {
    const question = getCurrentQuestion();
    const answer = answers[question.field as keyof ChatAnswers];
    
    if (question.required) {
      return answer !== undefined && answer !== null && answer !== '';
    }
    return true;
  }, [getCurrentQuestion, answers]);

  const getProgress = useCallback(() => {
    return Math.round(((currentStep + 1) / QUESTIONS.length) * 100);
  }, [currentStep]);

  return {
    currentStep,
    answers,
    chatId,
    isCompleted,
    isLoading,
    totalSteps: QUESTIONS.length,
    createChatSession,
    updateAnswer,
    nextStep,
    previousStep,
    reset,
    getCurrentQuestion,
    isCurrentStepValid,
    getProgress
  };
};