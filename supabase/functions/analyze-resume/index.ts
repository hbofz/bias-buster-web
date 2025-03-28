
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, scenarioId, prompt, userFingerprint, filename } = await req.json();

    if (!resumeText || !scenarioId || !prompt || !userFingerprint || !filename) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing resume for scenario: ${scenarioId}`);
    console.log(`Resume content length: ${resumeText.length} characters`);

    // Enhanced system prompt that emphasizes using the actual resume content
    const systemPrompt = `You are an expert in algorithmic bias in hiring systems. Your task is to analyze the provided resume and identify potential areas where bias could occur in automated hiring systems. 
    
    IMPORTANT: Base your analysis ONLY on the actual content provided in the resume. Do not make up or invent any information not present in the resume. If the resume doesn't contain sufficient information in certain areas, acknowledge this limitation rather than making assumptions.
    
    Analyze the following specific elements:
    1. Language and terminology used
    2. Education and credentials formatting
    3. Employment history presentation
    4. Skills representation
    5. Overall structure and organization
    
    Be specific in your feedback and cite exact phrases or sections from the resume.`;

    // Call OpenAI API to analyze the resume with enhanced prompt
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `${prompt}\n\nResume Content:\n${resumeText}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4, // Lower temperature for more factual, less creative responses
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API Error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Error calling OpenAI API', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received');
    
    let analysis;
    
    try {
      // Parse the response content as JSON
      analysis = JSON.parse(openAIData.choices[0].message.content);
      
      // Validate that the response contains required fields
      if (!analysis.biasScore || !analysis.feedback || !analysis.recommendations) {
        throw new Error('Response missing required fields');
      }
      
      // Log analysis summary for debugging
      console.log(`Generated bias score: ${analysis.biasScore}`);
      console.log(`Feedback items: ${analysis.feedback.length}`);
      console.log(`Recommendations: ${analysis.recommendations.length}`);
      
    } catch (e) {
      console.error('Error parsing OpenAI response as JSON:', e);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse AI response', 
          details: e.message,
          rawResponse: openAIData.choices[0].message.content.substring(0, 200) + "..." 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: {
          bias_score: analysis.biasScore,
          feedback: analysis.feedback,
          recommendations: analysis.recommendations
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
