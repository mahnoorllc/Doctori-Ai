import { useState } from 'react';

export interface SymptomData {
  mainSymptom: string;
  duration: string;
  isFirstTime: boolean;
  severity: number;
  location: string;
  additionalSymptoms: string[];
  medicalHistory: string[];
  gender: 'male' | 'female' | 'other' | '';
  age: string;
}

export interface QuestionStep {
  id: string;
  question: string;
  type: 'text' | 'select' | 'checkbox' | 'scale' | 'boolean';
  options?: string[];
  field: keyof SymptomData;
  required: boolean;
  followUp?: (data: SymptomData) => QuestionStep[];
}

const baseQuestions: QuestionStep[] = [
  {
    id: 'demographics',
    question: 'To provide better assistance, please share your basic information:',
    type: 'checkbox',
    options: [],
    field: 'gender',
    required: true
  },
  {
    id: 'main-symptom',
    question: 'What is your main symptom or health concern?',
    type: 'text',
    field: 'mainSymptom',
    required: true
  },
  {
    id: 'duration',
    question: 'How long have you been experiencing this symptom?',
    type: 'select',
    options: [
      'Less than 1 hour',
      '1-6 hours',
      '6-24 hours',
      '1-3 days',
      '3-7 days',
      '1-2 weeks',
      '2-4 weeks',
      'More than 1 month'
    ],
    field: 'duration',
    required: true
  },
  {
    id: 'first-time',
    question: 'Is this the first time you\'ve experienced this symptom?',
    type: 'boolean',
    field: 'isFirstTime',
    required: true
  },
  {
    id: 'severity',
    question: 'On a scale of 1-10, how would you rate the severity? (1 = mild, 10 = severe)',
    type: 'scale',
    field: 'severity',
    required: true
  },
  {
    id: 'location',
    question: 'Where exactly do you feel this symptom? (e.g., left side, right shoulder, upper abdomen)',
    type: 'text',
    field: 'location',
    required: false
  }
];

const getFollowUpQuestions = (symptom: string): QuestionStep[] => {
  const lowerSymptom = symptom.toLowerCase();
  
  if (lowerSymptom.includes('headache') || lowerSymptom.includes('head')) {
    return [
      {
        id: 'headache-type',
        question: 'What type of headache pain are you experiencing?',
        type: 'select',
        options: [
          'Throbbing/pulsing',
          'Sharp/stabbing',
          'Dull/aching',
          'Pressure/squeezing',
          'Burning'
        ],
        field: 'additionalSymptoms',
        required: true
      }
    ];
  }
  
  if (lowerSymptom.includes('chest') || lowerSymptom.includes('heart')) {
    return [
      {
        id: 'chest-pain-quality',
        question: 'How would you describe the chest discomfort?',
        type: 'select',
        options: [
          'Sharp/stabbing',
          'Crushing/pressure',
          'Burning',
          'Dull ache',
          'Tightness'
        ],
        field: 'additionalSymptoms',
        required: true
      }
    ];
  }
  
  if (lowerSymptom.includes('stomach') || lowerSymptom.includes('abdomen') || lowerSymptom.includes('belly')) {
    return [
      {
        id: 'abdominal-symptoms',
        question: 'Are you experiencing any of these additional symptoms?',
        type: 'checkbox',
        options: [
          'Nausea',
          'Vomiting',
          'Diarrhea',
          'Constipation',
          'Bloating',
          'Loss of appetite'
        ],
        field: 'additionalSymptoms',
        required: false
      }
    ];
  }
  
  return [
    {
      id: 'additional-symptoms',
      question: 'Are you experiencing any other symptoms along with this?',
      type: 'text',
      field: 'additionalSymptoms',
      required: false
    }
  ];
};

export const useSymptomQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [symptomData, setSymptomData] = useState<SymptomData>({
    mainSymptom: '',
    duration: '',
    isFirstTime: false,
    severity: 1,
    location: '',
    additionalSymptoms: [],
    medicalHistory: [],
    gender: '',
    age: ''
  });
  const [questions, setQuestions] = useState<QuestionStep[]>(baseQuestions);
  const [isComplete, setIsComplete] = useState(false);

  const updateAnswer = (field: keyof SymptomData, value: any) => {
    const newData = { ...symptomData, [field]: value };
    setSymptomData(newData);

    // If this is the main symptom, generate follow-up questions
    if (field === 'mainSymptom' && value) {
      const followUps = getFollowUpQuestions(value);
      const allQuestions = [...baseQuestions, ...followUps];
      setQuestions(allQuestions);
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentQuestion = () => questions[currentStep];

  const isCurrentStepValid = () => {
    const question = getCurrentQuestion();
    if (!question.required) return true;
    
    const value = symptomData[question.field];
    if (question.type === 'text') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    if (question.type === 'select') {
      return typeof value === 'string' && value.length > 0;
    }
    if (question.type === 'scale') {
      return typeof value === 'number' && value > 0;
    }
    if (question.type === 'boolean') {
      return typeof value === 'boolean';
    }
    return true;
  };

  const reset = () => {
    setCurrentStep(0);
    setSymptomData({
      mainSymptom: '',
      duration: '',
      isFirstTime: false,
      severity: 1,
      location: '',
      additionalSymptoms: [],
      medicalHistory: [],
      gender: '',
      age: ''
    });
    setQuestions(baseQuestions);
    setIsComplete(false);
  };

  return {
    currentStep,
    symptomData,
    questions,
    isComplete,
    getCurrentQuestion,
    updateAnswer,
    nextStep,
    previousStep,
    isCurrentStepValid,
    reset,
    totalSteps: questions.length
  };
};