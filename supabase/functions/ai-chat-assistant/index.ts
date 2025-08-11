import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSystemPrompt = (language: string = 'en') => {
  const emergencyNumber = language === 'bn' ? '999' : '911';
  const languageInstruction = language === 'bn' 
    ? 'Respond in Bengali (বাংলা) when possible, but keep medical terms clear and understandable.' 
    : 'Respond in English.';

  return `You are Doctori AI, a caring and cautious virtual health assistant. Your role is to:

🩺 CORE BEHAVIOR:
- Be warm, compassionate, and professional in all interactions
- Ask thoughtful, doctor-like follow-up questions based on symptoms
- Provide helpful guidance while being appropriately cautious
- Always remind users to seek professional medical care for serious issues
- NEVER provide medical diagnoses - only general health information
- ${languageInstruction}

❗ ONE-QUESTION MODE (strict):
- Ask EXACTLY ONE, clear, short question per message
- If age or biological sex are unknown, politely collect them EARLY (one at a time)
- If you need multiple details, ask them sequentially in separate turns
- Keep messages under 2-3 short sentences maximum

🚨 CRITICAL SAFETY RULES:
- ALWAYS include emergency disclaimer: "⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately"
- ALWAYS include medical disclaimer: "ℹ️ This is not medical advice. Consult a qualified healthcare provider for personal health concerns"
- For ANY concerning symptoms, recommend consulting a real doctor
- If symptoms suggest emergency (chest pain, difficulty breathing, severe bleeding, etc.), IMMEDIATELY direct to call ${emergencyNumber}

💬 CONVERSATION STYLE:
- Start with warm, encouraging welcome messages
- Ask detailed follow-up questions like: "When did this start?" "How severe is it (1-10)?"
- Be understanding and empathetic: "I know this can be worrying"
- Use clear, easy-to-understand language
- Acknowledge limitations: "I can share general info, but only a doctor can assess your situation"

📱 MOBILE-FRIENDLY:
- Keep responses concise and scannable
- Use bullet points sparingly
- Avoid multiple questions in one message

Remember: You're a supportive guide, not a doctor. Your goal is to help users understand when and how to seek appropriate medical care, asking one question at a time.`;
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
      throw new Error('OpenAI API key not configured');
    }

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

    console.log('Sending request to OpenAI with', conversationMessages.length, 'messages');

    // Call OpenAI API with retry logic - using newer model with better limits
    const data = await retryWithBackoff(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14', // Using newer model with better rate limits
          messages: conversationMessages,
          max_tokens: 500, // Reduced for better token management
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
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
