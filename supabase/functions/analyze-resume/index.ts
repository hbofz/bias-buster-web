
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
    
    // Create specific system prompts based on the scenario
    let systemPrompt;
    
    if (scenarioId === "amazon") {
      systemPrompt = `You are an AI tool that analyzes resumes for potential gender bias in hiring algorithms.

EXTREMELY IMPORTANT: Your analysis MUST be based EXCLUSIVELY on the content provided in this specific resume. DO NOT make up or assume any information not present in the resume. If you can't find specific elements to analyze, acknowledge this fact in your feedback.

For this specific scenario about gender bias:
1. Analyze terminology and language patterns that might trigger algorithmic gender bias (examples: dominated, crushed it, competitive sports vs collaborative activities)
2. Look for specific examples of activities, roles, or achievements that might be interpreted differently based on gender (leadership vs support roles)
3. Examine how educational credentials and work history are presented (action verbs, assertiveness)
4. Consider how leadership, teamwork, and other qualities are described (are they communicated in gender-stereotyped ways?)
5. Look for gender indicators (women's colleges, gendered activities, organizations with gender in the name)

Consider how gender bias emerges in hiring algorithms:
- Male-dominated training data means masculine-coded language is often rewarded
- Historically successful (mostly male) candidates inform what "good" looks like
- Aggressive, competitive language often scores higher than collaborative, supportive language
- School and location names can serve as proxy variables for gender

Your response must be a JSON object with two properties:
1) biasScore: a number between 40-85 representing potential gender bias impact (higher means more concerning)
2) feedback: an array of 3-4 specific elements from the resume that might trigger gender bias, DIRECTLY QUOTING actual text from the resume

You MUST reference actual content from the resume. If you cannot find enough material to analyze, mention this in your feedback rather than making things up.

For male resumes, the biasScore should generally be lower (40-55) as they often match the expected patterns.
For female resumes, the biasScore should generally be higher (65-80) as they often trigger gender bias filters.`;
    } else if (scenarioId === "socioeconomic") {
      systemPrompt = `You are an AI tool that analyzes resumes for socioeconomic bias in hiring algorithms.

EXTREMELY IMPORTANT: Your analysis MUST be based EXCLUSIVELY on the content provided in this specific resume. DO NOT make up or assume any information not present in the resume. If you can't find specific elements to analyze, acknowledge this fact in your feedback.

For this specific scenario about socioeconomic bias:
1. Analyze school names and locations (prestigious vs. unknown institutions, zip codes)
2. Examine internship and work opportunities (paid vs. unpaid, well-known companies)
3. Look for extracurricular activities that require financial resources (travel, expensive hobbies)
4. Note gaps in employment or education that might indicate financial hardship
5. Consider language that suggests access to networks and social capital (referrals, connections)

Consider how socioeconomic bias emerges in hiring algorithms:
- Prestigious school names are rewarded in training data from historically successful candidates
- Addresses and zip codes can serve as proxy variables for socioeconomic status
- Certain extracurriculars, volunteering, and unpaid internships require financial support
- Language patterns and writing style can indicate educational background
- Network access is often tied to socioeconomic status

Your response must be a JSON object with two properties:
1) biasScore: a number between 40-85 representing potential socioeconomic bias impact (higher means more concerning)
2) feedback: an array of 3-4 specific elements from the resume that might trigger socioeconomic bias, DIRECTLY QUOTING actual text from the resume

You MUST reference actual content from the resume. If you cannot find enough material to analyze, mention this in your feedback rather than making things up.

For resumes with prestigious schools, addresses in wealthy areas, and expensive activities, the biasScore should generally be lower (40-55) as they match privileged patterns.
For resumes with less prestigious schools, addresses in less wealthy areas, and fewer elite experiences, the biasScore should generally be higher (65-80) as they may be filtered out.`;
    } else {
      systemPrompt = `You are an expert in algorithmic bias in hiring systems tasked with analyzing this specific resume.
      
EXTREMELY IMPORTANT: Your analysis MUST be based EXCLUSIVELY on the content provided in this specific resume. DO NOT make up or assume any information not present in the resume. If you can't find specific elements to analyze, acknowledge this fact in your feedback.

Analyze the following specific elements from the resume:
1. Language and terminology used
2. Education and credentials formatting
3. Employment history presentation
4. Skills representation and keyword usage

Your response must be a JSON object with two properties:
1) biasScore: a number between 40-85 representing potential bias impact (higher means more concerning)
2) feedback: an array of 3-4 specific elements from the resume that might trigger bias, DIRECTLY QUOTING actual text from the resume

You MUST reference actual content from the resume. If you cannot find enough material to analyze, mention this in your feedback rather than making things up.`;
    }

    // Trim the resume text if it's too large
    const maxLength = 15000; // Limit to 15,000 characters to prevent token limits
    const trimmedText = resumeText.length > maxLength ? 
      resumeText.substring(0, maxLength) + "... [trimmed for length]" : 
      resumeText;

    console.log(`Using ${trimmedText.length} characters for analysis`);

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this resume for ${scenarioId === "amazon" ? "gender bias" : "socioeconomic bias"} potential. Here is the full text content of the resume: "${trimmedText}"`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2, // Lower temperature for more consistent and accurate responses
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
      if (!analysis.biasScore || !analysis.feedback) {
        throw new Error('Response missing required fields');
      }

      // Ensure feedback is an array
      if (!Array.isArray(analysis.feedback)) {
        throw new Error('Feedback must be an array');
      }
      
      // Log analysis summary for debugging
      console.log(`Generated bias score: ${analysis.biasScore}`);
      console.log(`Feedback items: ${analysis.feedback.length}`);
      console.log(`First feedback item: ${analysis.feedback[0].substring(0, 50)}...`);
      
    } catch (e) {
      console.error('Error parsing OpenAI response as JSON:', e);
      console.error('Raw response content:', openAIData.choices[0].message.content);
      
      // Fallback response to prevent breaking the UI
      analysis = {
        biasScore: scenarioId === "amazon" ? 65 : 55,
        feedback: [
          "Could not properly analyze the specific content of your resume. This might be due to text extraction issues.",
          "The resume format may not have been properly processed for detailed analysis.",
          "Our system had difficulty identifying specific elements to provide personalized feedback."
        ]
      };
      
      console.log('Using fallback analysis due to parsing error');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: {
          bias_score: analysis.biasScore,
          feedback: analysis.feedback
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        success: false,
        analysis: {
          bias_score: 50,
          feedback: [
            "An error occurred while analyzing your resume.",
            "The system was unable to process the file content properly.",
            "Your resume may be in a format that's difficult for our system to parse."
          ]
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
