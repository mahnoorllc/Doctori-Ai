const healthKeywords = [
  "symptom", "symptoms", "pain", "ache", "fever", "temperature", "rash", "headache", 
  "doctor", "clinic", "hospital", "medical", "cough", "cold", "flu", "illness",
  "medicine", "medication", "drug", "pills", "injury", "wound", "cut", "bruise",
  "health", "wellness", "mental", "depression", "anxiety", "stress", "tired",
  "fatigue", "dizzy", "nausea", "vomit", "stomach", "belly", "chest", "heart",
  "breathing", "breath", "lung", "throat", "sore", "hurt", "swollen", "infection",
  "appointment", "consultation", "diagnosis", "treatment", "therapy", "therapist",
  "nutrition", "diet", "weight", "sleep", "insomnia", "allergy", "allergic",
  "blood", "pressure", "diabetes", "cancer", "tumor", "lump", "bump", "skin",
  "eyes", "vision", "hearing", "ear", "nose", "mouth", "teeth", "dental",
  "pregnancy", "pregnant", "period", "menstrual", "contraception", "birth control",
  "vaccine", "vaccination", "immunization", "checkup", "exam", "test", "lab",
  "x-ray", "scan", "surgery", "operation", "emergency", "urgent", "first aid",
  "bone", "joint", "muscle", "back", "neck", "shoulder", "knee", "ankle",
  "arm", "leg", "hand", "foot", "finger", "toe", "head", "face"
];

export function isHealthRelated(input: string): boolean {
  const lowerInput = input.toLowerCase();
  
  // Check for health keywords
  const hasHealthKeywords = healthKeywords.some(word => lowerInput.includes(word));
  
  // Check for question patterns that might be health-related even without keywords
  const healthQuestionPatterns = [
    /feel/i, /sick/i, /unwell/i, /problem/i, /issue/i, /concern/i,
    /what.*wrong/i, /why.*hurt/i, /should.*see/i, /need.*help/i,
    /how.*treat/i, /what.*take/i, /is.*normal/i, /worried/i, /scared/i
  ];
  
  const hasHealthPatterns = healthQuestionPatterns.some(pattern => pattern.test(lowerInput));
  
  // If it's a greeting or very short message, consider it potentially health-related
  const greetingPatterns = [/^(hi|hello|hey|good morning|good afternoon|good evening)/i];
  const isGreeting = greetingPatterns.some(pattern => pattern.test(lowerInput.trim()));
  
  const isVeryShort = lowerInput.trim().split(' ').length <= 3;
  
  return hasHealthKeywords || hasHealthPatterns || isGreeting || isVeryShort;
}

export const getHealthFilterResponse = () => {
  return `🩺 I'm here to help with your health and medical concerns. Please ask me about symptoms, health conditions, or medical questions.

If you're experiencing a medical emergency, please call 911 immediately.

For other topics, please consult appropriate sources or specialists.`;
};