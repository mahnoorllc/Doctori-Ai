import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const getSystemPrompt = (language: string = 'en') => {
  const emergencyNumber = language === 'bn' ? '999' : '911';
  const languageInstruction = language === 'bn' 
    ? 'Respond in Bengali (বাংলা) when the user writes in Bengali, but keep medical terms clear and understandable.' 
    : 'Respond in English when the user writes in English.';

  return `You are Doctori AI, an intelligent health assistant and virtual medical interviewer. Your goal is to gather accurate health information from users to suggest the most suitable doctor from our database and provide optional safe home remedies for minor relief.

🩺 CORE BEHAVIOR:
- Be friendly, professional, and empathetic throughout all interactions
- Act like a virtual doctor conducting a medical interview
- Gather comprehensive health information step by step
- Never provide medical prescriptions or diagnoses—only guidance and recommendations
- ${languageInstruction}

👤 USER CHECK:
- If the user is registered, do NOT ask for age or gender
- If the user is not registered, politely ask for gender and age first to help make better recommendations

❗ STEP-BY-STEP QUESTIONING (CRITICAL):
- Ask EXACTLY ONE question at a time to fully understand the user's main problem
- Start with the primary symptom, then ask follow-ups based on answers (duration, severity, triggers, medical history, lifestyle)
- Always confirm important or unclear responses before moving on, e.g., "Just to confirm, did you mean...?"
- Continue one question at a time until enough information is collected to determine the type of doctor needed
- If the user asks anything not related to health, politely ignore it and remind them: "Please ask only health-related questions so I can help you accurately."

📋 END OF CONVERSATION / SUMMARY:
When sufficient information is collected, provide a structured summary with these headings:
- Age and Gender (if collected)
- Main Symptoms
- Relevant History  
- Lifestyle Notes
- Suggested Doctor(s) from our database
- Optional safe home remedies for temporary relief
- Inform the user that this summary can be exported as a PDF

🚨 SAFETY RULES:
- For medical emergencies (chest pain, difficulty breathing, severe bleeding), IMMEDIATELY direct to call ${emergencyNumber}
- Always include: "⚠️ EMERGENCY: If experiencing a medical emergency, call ${emergencyNumber} immediately"
- Always include: "ℹ️ This is not medical advice. Always consult a qualified healthcare provider for personal health concerns"

💬 CONVERSATION RULES:
- Ask one question at a time until sufficient info is collected
- Ignore non-health queries and guide user back to relevant questions
- Be understanding and empathetic: "I understand this can be concerning"
- Use clear, easy-to-understand language
- Keep responses concise and focused

Remember: You are a virtual medical interviewer collecting health information to recommend the right doctor and provide helpful guidance. Always ask one question at a time and ignore non-health topics.`;
};

// Function to summarize conversation history when it gets too long
const summarizeConversation = (messages: any[]) => {
  // Keep only the last 4 messages (2 exchanges) plus system prompt for better token management
  if (messages.length <= 5) return messages;
  
  const systemMessage = messages[0];
  const recentMessages = messages.slice(-4);
  
  // Create a summary of the older messages
  const olderMessages = messages.slice(1, -4);
  const summaryContent = `Previous conversation summary: The user discussed ${olderMessages.length > 0 ? 'various health concerns' : 'initial health questions'}. Recent context continues below.`;
  
  return [
    systemMessage,
    { role: "system", content: summaryContent },
    ...recentMessages
  ];
};

// Enhanced retry function with better backoff strategy
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3, baseDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a rate limit error
      if (error.message && (error.message.includes('rate limit') || error.message.includes('Rate limit'))) {
        // For rate limits, use longer delays
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 2000; // 2-6 seconds range
        console.log(`Rate limit hit, waiting ${Math.round(delay)}ms before retry ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // For other errors, shorter delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userMessage, sessionContext } = await req.json();
    
    if (!userMessage) {
      throw new Error('Message content is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing chat request with message length:', userMessage.length);

    // Get language from session context
    const language = sessionContext?.language || 'en';
    const systemPrompt = getSystemPrompt(language);

    // Prepare conversation context with system prompt
    let conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    // Summarize conversation if it's getting too long
    conversationMessages = summarizeConversation(conversationMessages);

    console.log('Sending request to OpenAI with', conversationMessages.length, 'messages using gpt-4o-mini model');

    // Call OpenAI API with retry logic - using gpt-4o-mini as requested
    const data = await retryWithBackoff(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using gpt-4o-mini as requested
          messages: conversationMessages,
          max_tokens: 500, // Using max_tokens for gpt-4o-mini (legacy model)
          temperature: 0.7, // gpt-4o-mini supports temperature
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }
        
        console.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Handle specific error types
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        } else if (response.status === 401) {
          throw new Error('Invalid API key or insufficient quota');
        } else if (response.status === 400) {
          throw new Error(`Invalid request: ${errorData.error?.message || 'Bad request'}`);
        }
        
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    }, 3, 3000); // 3 retries with 3 second base delay

    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI response generated successfully');
    console.log('Token usage:', data.usage);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage,
      messageCount: conversationMessages.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in ai-chat-assistant function:', error);
    
    // Different fallback messages based on error type
    let fallbackResponse;
    const emergencyNumber = '911'; // Default to 911, will be overridden by language context if needed
    
    if (error.message && (error.message.includes('rate limit') || error.message.includes('Rate limit'))) {
      fallbackResponse = `I'm experiencing high demand right now and need a moment to respond. Please try again in a few seconds.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`;
    } else if (error.message && error.message.includes('API key')) {
      fallbackResponse = `I'm having trouble connecting to my AI services right now. Please try again in a moment.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`;
    } else {
      fallbackResponse = `I'm sorry, I'm having trouble processing your request right now. Let me try to help you anyway.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`;
    }

    const statusCode = error.message?.includes('rate limit') ? 429 : 
                      error.message?.includes('API key') ? 401 : 500;

    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      error: error.message.includes('rate limit') ? "Rate limit exceeded" : 
             error.message.includes('API key') ? "API authentication error" :
             "AI service temporarily unavailable",
      retryAfter: error.message.includes('rate limit') ? 15 : 5
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
