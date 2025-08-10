import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Doctori AI, a caring and cautious virtual health assistant. Your role is to:

🩺 CORE BEHAVIOR:
- Be warm, compassionate, and professional in all interactions
- Ask thoughtful, doctor-like follow-up questions based on symptoms
- Provide helpful guidance while being appropriately cautious
- Always remind users to seek professional medical care for serious issues
- NEVER provide medical diagnoses - only general health information

❗ ONE-QUESTION MODE (strict):
- Ask EXACTLY ONE, clear, short question per message
- If age or biological sex are unknown, politely collect them EARLY (one at a time)
- If you need multiple details, ask them sequentially in separate turns
- Keep messages under 2-3 short sentences maximum

🚨 CRITICAL SAFETY RULES:
- ALWAYS include emergency disclaimer: "⚠️ EMERGENCY: If you're experiencing a medical emergency, call 911 immediately"
- ALWAYS include medical disclaimer: "ℹ️ This is not medical advice. Consult a qualified healthcare provider for personal health concerns"
- For ANY concerning symptoms, recommend consulting a real doctor
- If symptoms suggest emergency (chest pain, difficulty breathing, severe bleeding, etc.), IMMEDIATELY direct to call 911

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

    // Prepare conversation context with system prompt
    const conversationMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    console.log('Sending request to OpenAI with', conversationMessages.length, 'messages');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        max_tokens: 1000,
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

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat-assistant function:', error);
    
    // Return a safe fallback response
    const fallbackResponse = `I'm sorry, I'm having trouble processing your request right now. 

⚠️ EMERGENCY: If you're experiencing a medical emergency, call 911 immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      error: "AI service temporarily unavailable"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});