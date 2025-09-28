import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing AI query:', message);

    // Call OpenAI API
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
            content: `You are PowerSupport AI, an intelligent IT helpdesk assistant for POWERGRID (Government of India PSU). 
            
Your role:
- Provide step-by-step technical solutions for common IT issues
- Offer troubleshooting guidance for hardware, software, and network problems
- Help with Windows, Office applications, email, and connectivity issues
- Be professional, concise, and solution-focused
- If you cannot resolve an issue, recommend escalating to IT support

Always format your responses clearly with:
1. Brief problem acknowledgment
2. Step-by-step solution
3. Additional tips if relevant
4. When to escalate if the solution doesn't work

Keep responses professional and government-appropriate.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    // Generate a simple ticket ID for tracking
    const ticketId = `PWR-${Date.now().toString().slice(-6)}`;

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        ticketId: ticketId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});