// Medical knowledge base for symptom analysis and safety checks

export interface SymptomAnalysis {
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  possibleConditions: string[];
  recommendations: string[];
  redFlags: string[];
  questionsToAsk: string[];
  specialtyRecommendation: string;
}

export interface MedicalDisclaimer {
  text: string;
  urgency: 'standard' | 'urgent' | 'emergency';
}

// Emergency symptoms that require immediate medical attention
const EMERGENCY_SYMPTOMS = [
  'chest pain', 'severe chest pain', 'crushing chest pain',
  'difficulty breathing', 'shortness of breath', 'can\'t breathe',
  'unconscious', 'loss of consciousness', 'fainted', 'passed out',
  'severe bleeding', 'heavy bleeding', 'blood loss',
  'stroke symptoms', 'facial drooping', 'slurred speech',
  'heart attack', 'cardiac arrest',
  'severe head injury', 'head trauma',
  'seizure', 'convulsions',
  'severe allergic reaction', 'anaphylaxis',
  'suicide', 'suicidal thoughts', 'self-harm'
];

// High urgency symptoms requiring urgent care within hours
const HIGH_URGENCY_SYMPTOMS = [
  'severe pain', 'excruciating pain', 'unbearable pain',
  'high fever', 'fever over 103', 'temperature above 39',
  'severe headache', 'worst headache ever',
  'persistent vomiting', 'can\'t keep fluids down',
  'severe dehydration',
  'sudden vision loss', 'sudden hearing loss',
  'severe abdominal pain',
  'signs of infection', 'spreading redness'
];

// Symptom to specialty mapping
const SPECIALTY_MAPPING: Record<string, string> = {
  'chest': 'Cardiology',
  'heart': 'Cardiology',
  'cardiac': 'Cardiology',
  'blood pressure': 'Cardiology',
  'headache': 'Neurology',
  'migraine': 'Neurology',
  'seizure': 'Neurology',
  'memory': 'Neurology',
  'skin': 'Dermatology',
  'rash': 'Dermatology',
  'acne': 'Dermatology',
  'mole': 'Dermatology',
  'child': 'Pediatrics',
  'baby': 'Pediatrics',
  'infant': 'Pediatrics',
  'pregnancy': 'Obstetrics/Gynecology',
  'pregnant': 'Obstetrics/Gynecology',
  'period': 'Obstetrics/Gynecology',
  'menstrual': 'Obstetrics/Gynecology',
  'mental': 'Psychiatry',
  'anxiety': 'Psychiatry',
  'depression': 'Psychiatry',
  'stress': 'Psychiatry',
  'panic': 'Psychiatry',
  'mood': 'Psychiatry',
  'bone': 'Orthopedics',
  'joint': 'Orthopedics',
  'fracture': 'Orthopedics',
  'back pain': 'Orthopedics',
  'knee': 'Orthopedics',
  'shoulder': 'Orthopedics',
  'eye': 'Ophthalmology',
  'vision': 'Ophthalmology',
  'blind': 'Ophthalmology',
  'ear': 'ENT',
  'hearing': 'ENT',
  'throat': 'ENT',
  'nose': 'ENT',
  'sinus': 'ENT',
  'stomach': 'Gastroenterology',
  'nausea': 'Gastroenterology',
  'diarrhea': 'Gastroenterology',
  'constipation': 'Gastroenterology',
  'abdominal': 'Gastroenterology',
  'kidney': 'Urology',
  'bladder': 'Urology',
  'urination': 'Urology',
  'prostate': 'Urology'
};

// Common medical questions for symptom assessment
const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  pain: [
    'On a scale of 1-10, how would you rate your pain?',
    'How long have you been experiencing this pain?',
    'Is the pain constant or does it come and go?',
    'What makes the pain better or worse?',
    'Can you describe the type of pain (sharp, dull, burning, etc.)?'
  ],
  fever: [
    'What is your current temperature?',
    'How long have you had a fever?',
    'Are you experiencing chills or sweating?',
    'Have you taken any fever-reducing medications?',
    'Do you have any other symptoms along with the fever?'
  ],
  breathing: [
    'Are you having trouble breathing right now?',
    'When did the breathing difficulty start?',
    'Is it worse when you lie down or with activity?',
    'Do you have chest pain with the breathing difficulty?',
    'Have you had any recent illness or travel?'
  ],
  general: [
    'How long have you been experiencing these symptoms?',
    'Have you had these symptoms before?',
    'Are you currently taking any medications?',
    'Do you have any known allergies?',
    'Do you have any chronic medical conditions?'
  ]
};

export const analyzeSymptoms = (description: string): SymptomAnalysis => {
  const lowerDescription = description.toLowerCase();
  
  // Check for emergency symptoms
  const emergencyFound = EMERGENCY_SYMPTOMS.some(symptom => 
    lowerDescription.includes(symptom)
  );
  
  // Check for high urgency symptoms
  const highUrgencyFound = HIGH_URGENCY_SYMPTOMS.some(symptom => 
    lowerDescription.includes(symptom)
  );
  
  // Determine urgency level
  let urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
  if (emergencyFound) {
    urgencyLevel = 'emergency';
  } else if (highUrgencyFound) {
    urgencyLevel = 'high';
  } else if (lowerDescription.includes('severe') || lowerDescription.includes('intense')) {
    urgencyLevel = 'medium';
  }
  
  // Extract symptoms
  const detectedSymptoms = Object.keys(SPECIALTY_MAPPING).filter(symptom =>
    lowerDescription.includes(symptom)
  );
  
  // Determine specialty
  const specialtyRecommendation = detectedSymptoms.length > 0
    ? SPECIALTY_MAPPING[detectedSymptoms[0]]
    : 'General Practice';
  
  // Generate questions based on symptoms
  let questionsToAsk: string[] = [];
  if (lowerDescription.includes('pain')) {
    questionsToAsk = FOLLOW_UP_QUESTIONS.pain;
  } else if (lowerDescription.includes('fever')) {
    questionsToAsk = FOLLOW_UP_QUESTIONS.fever;
  } else if (lowerDescription.includes('breath') || lowerDescription.includes('breathing')) {
    questionsToAsk = FOLLOW_UP_QUESTIONS.breathing;
  } else {
    questionsToAsk = FOLLOW_UP_QUESTIONS.general;
  }
  
  // Generate recommendations based on urgency
  let recommendations: string[] = [];
  if (urgencyLevel === 'emergency') {
    recommendations = [
      'Seek immediate medical attention',
      'Call 911 or go to the nearest emergency room',
      'Do not delay seeking care',
      'Have someone accompany you if possible'
    ];
  } else if (urgencyLevel === 'high') {
    recommendations = [
      'Seek urgent medical care within 2-4 hours',
      'Contact your doctor immediately',
      'Consider urgent care or emergency room',
      'Monitor symptoms closely'
    ];
  } else if (urgencyLevel === 'medium') {
    recommendations = [
      'Schedule an appointment with your doctor within 24-48 hours',
      'Monitor symptoms for any worsening',
      'Consider telehealth consultation',
      'Keep a symptom diary'
    ];
  } else {
    recommendations = [
      'Consider scheduling a routine appointment',
      'Monitor symptoms over the next few days',
      'Try home remedies if appropriate',
      'Contact doctor if symptoms worsen'
    ];
  }
  
  // Identify red flags
  const redFlags: string[] = [];
  if (emergencyFound) {
    redFlags.push('Emergency symptoms detected - immediate care needed');
  }
  if (lowerDescription.includes('sudden') && lowerDescription.includes('severe')) {
    redFlags.push('Sudden onset of severe symptoms');
  }
  
  return {
    symptoms: detectedSymptoms,
    urgencyLevel,
    possibleConditions: [], // This would be expanded with actual medical conditions
    recommendations,
    redFlags,
    questionsToAsk,
    specialtyRecommendation
  };
};

export const getMedicalDisclaimer = (urgencyLevel: 'low' | 'medium' | 'high' | 'emergency'): MedicalDisclaimer => {
  if (urgencyLevel === 'emergency') {
    return {
      text: '🚨 MEDICAL EMERGENCY: This AI assistant has detected symptoms that may require immediate medical attention. Call 911 or go to your nearest emergency room immediately. This is not medical advice and should not replace emergency medical care.',
      urgency: 'emergency'
    };
  } else if (urgencyLevel === 'high') {
    return {
      text: '⚠️ URGENT: Your symptoms may require prompt medical attention. Please contact your healthcare provider or seek urgent care immediately. This AI assistant provides general information only and is not a substitute for professional medical advice.',
      urgency: 'urgent'
    };
  } else {
    return {
      text: 'ℹ️ DISCLAIMER: This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.',
      urgency: 'standard'
    };
  }
};

export const generateDoctorVisitPreparation = (
  symptoms: string[],
  responses: Record<string, string>,
  urgencyLevel: string
) => {
  return {
    summary: `Patient reports ${symptoms.join(', ')} with ${urgencyLevel} urgency level.`,
    questionsForDoctor: [
      'What could be causing these symptoms?',
      'What tests or examinations do you recommend?',
      'What treatment options are available?',
      'When should I expect to see improvement?',
      'What warning signs should I watch for?',
      'Are there any lifestyle changes I should make?'
    ],
    symptomsTimeline: Object.entries(responses).map(([key, value]) => ({
      question: key,
      answer: value,
      timestamp: new Date().toISOString()
    })),
    medicationsToDiscuss: [
      'Current medications and dosages',
      'Any over-the-counter medications taken',
      'Supplements or herbal remedies',
      'Known drug allergies'
    ]
  };
};