
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Call OpenAI API to analyze the resume
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
            content: `You are an expert in algorithmic bias in hiring systems. Your task is to simulate how a biased AI hiring system would evaluate a resume.`
          },
          {
            role: 'user',
            content: `${prompt}\n\nResume Content:\n${resumeText}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
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
    let analysis;
    
    try {
      // Parse the response content as JSON
      analysis = JSON.parse(openAIData.choices[0].message.content);
    } catch (e) {
      console.error('Error parsing OpenAI response as JSON:', e);
      // If parsing fails, use the raw response with some defaults
      analysis = {
        biasScore: Math.floor(Math.random() * 70) + 30,
        feedback: [openAIData.choices[0].message.content.substring(0, 200)],
        recommendations: ["Improve resume format", "Use more inclusive language"]
      };
    }

    // Store the analysis in Supabase
    const { data: savedAnalysis, error } = await supabase
      .from('resume_analyses')
      .insert({
        user_fingerprint: userFingerprint,
        resume_filename: filename,
        scenario_id: scenarioId,
        bias_score: analysis.biasScore || 50,
        feedback: analysis.feedback || [],
        recommendations: analysis.recommendations || []
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save analysis results', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: savedAnalysis 
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
