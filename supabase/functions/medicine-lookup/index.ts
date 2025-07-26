import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicineName } = await req.json();

    if (!medicineName) {
      return new Response(JSON.stringify({ error: 'Medicine name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a medical information assistant. Provide accurate, comprehensive information about medicines in JSON format. Always include safety warnings and disclaimers. Return ONLY valid JSON with this exact structure:
            {
              "name": "Medicine Name",
              "genericName": "Generic name if different",
              "category": "Drug category (e.g., Analgesic, Antibiotic)",
              "uses": ["Primary use 1", "Primary use 2"],
              "dosage": "Standard dosage information with warnings about consulting healthcare providers",
              "sideEffects": ["Common side effect 1", "Common side effect 2"],
              "precautions": ["Important precaution 1", "Important precaution 2"],
              "brandNames": ["Brand name 1", "Brand name 2"],
              "alternatives": ["Alternative medicine 1", "Alternative medicine 2"]
            }`
          },
          {
            role: 'user',
            content: `Provide detailed medical information about: ${medicineName}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const medicineText = data.choices[0].message.content;

    try {
      const medicineInfo = JSON.parse(medicineText);
      
      return new Response(JSON.stringify({ medicineInfo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', medicineText);
      return new Response(JSON.stringify({ error: 'Failed to parse medicine information' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in medicine-lookup function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});