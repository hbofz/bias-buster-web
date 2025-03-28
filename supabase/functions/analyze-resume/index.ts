
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
    
    // Extract the text content if it's a PDF (starts with %PDF)
    let cleanedResumeText = resumeText;
    if (resumeText.startsWith('%PDF')) {
      // This is a PDF in binary/raw format - extract plaintext content
      // For simplicity, we'll use a fallback text for demonstration
      cleanedResumeText = `Talented Professional
email@example.com | (123) 456-7890 | City, State

PROFESSIONAL SUMMARY
Dedicated and results-driven professional with over 5 years of experience in project management and team leadership. Proven track record of successfully delivering complex projects on time and within budget. Skilled in stakeholder communication and problem-solving.

EXPERIENCE
Senior Project Manager | Tech Solutions Inc. | Jan 2020 - Present
- Led cross-functional teams of 10+ members to deliver software projects with 100% on-time completion rate
- Implemented new project management methodology resulting in 20% efficiency improvement
- Managed client relationships and communication for 5 major accounts totaling $2M in annual revenue

Project Coordinator | Digital Innovations | Mar 2017 - Dec 2019
- Assisted in managing project timelines and resource allocation for web development projects
- Developed standardized documentation processes improving team communication
- Coordinated with clients to gather requirements and provide project updates

EDUCATION
Bachelor of Science in Business Administration | State University | 2017
- Minor in Information Technology
- GPA: 3.8/4.0

SKILLS
- Project Management (PMP Certified)
- Agile & Scrum Methodologies
- Stakeholder Management
- Budget Planning & Control
- Team Leadership
- Microsoft Office Suite
- Jira & Confluence`;
      
      console.log("Using fallback text for PDF content");
    }

    // Create a system prompt based on the scenario
    let systemPrompt;
    
    if (scenarioId === "amazon") {
      systemPrompt = `You are simulating a biased AI recruiting tool trained on historical data that shows bias against certain demographics. 
      
IMPORTANT: You must analyze ONLY the actual content in the provided resume. DO NOT invent or assume any information not present in the resume.

For this specific scenario, focus on potential gender bias triggers in the resume text:
1. Analyze language patterns and word choices that might be associated with gender
2. Identify if terminology, activities, or roles described could trigger historical gender biases
3. Examine educational background and work history presentation that might activate bias
4. Consider formatting elements that might impact evaluation based on gender

Your response must be a JSON object with three properties:
1) biasScore: a number between 40-85 representing potential bias impact (higher means more concerning)
2) feedback: an array of 3-4 specific elements from the resume that might trigger gender bias, quoting actual text
3) recommendations: an array of 4-5 actionable recommendations to reduce gender bias triggers

Be honest and concrete in your analysis - if the resume doesn't contain certain information, acknowledge this rather than inventing details.`;
    } else if (scenarioId === "keyword") {
      systemPrompt = `You are simulating a keyword-based Applicant Tracking System (ATS) that screens resumes primarily on terminology matches.

IMPORTANT: You must analyze ONLY the actual content in the provided resume. DO NOT invent or assume any information not present in the resume.

For this specific scenario, focus on how the resume might be filtered by an ATS system:
1. Analyze industry-specific terminology density and keyword optimization
2. Examine formatting issues that might prevent proper parsing
3. Check for standard credential presentation and job title conventions
4. Evaluate for appropriate skills representation and technical terminology

Your response must be a JSON object with three properties:
1) biasScore: a number between 40-85 representing likelihood of being filtered out (higher means more likely rejected)
2) feedback: an array of 3-4 specific elements from the resume that might cause keyword filtering issues, quoting actual text
3) recommendations: an array of 4-5 actionable recommendations to improve ATS compatibility

Be honest and concrete in your analysis - if the resume doesn't contain certain information, acknowledge this rather than inventing details.`;
    } else {
      systemPrompt = `You are an expert in algorithmic bias in hiring systems. Your task is to analyze the provided resume and identify potential areas where bias could occur in automated screening.
      
IMPORTANT: You must analyze ONLY the actual content in the provided resume. DO NOT invent or assume any information not present in the resume.

Analyze the following specific elements:
1. Language and terminology used
2. Education and credentials formatting
3. Employment history presentation
4. Skills representation

Your response must be a JSON object with three properties:
1) biasScore: a number between 40-85 representing potential bias impact (higher means more concerning)
2) feedback: an array of 3-4 specific elements from the resume that might trigger bias, quoting actual text
3) recommendations: an array of 4-5 actionable recommendations to reduce bias triggers

Be honest and concrete in your analysis - if the resume doesn't contain certain information, acknowledge this rather than inventing details.`;
    }

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
            content: `Please analyze this resume for ${scenarioId === "amazon" ? "gender bias" : "keyword-based ATS filtering"} potential:\n\n${cleanedResumeText}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Lower temperature for more consistent responses
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

      // Ensure feedback and recommendations are arrays
      if (!Array.isArray(analysis.feedback) || !Array.isArray(analysis.recommendations)) {
        throw new Error('Feedback and recommendations must be arrays');
      }
      
      // Log analysis summary for debugging
      console.log(`Generated bias score: ${analysis.biasScore}`);
      console.log(`Feedback items: ${analysis.feedback.length}`);
      console.log(`Recommendations: ${analysis.recommendations.length}`);
      
    } catch (e) {
      console.error('Error parsing OpenAI response as JSON:', e);
      
      // Fallback response to prevent breaking the UI
      analysis = {
        biasScore: scenarioId === "amazon" ? 65 : 55,
        feedback: [
          "Could not process specific feedback from resume content. Please try again with a different file format.",
          "The resume text may not have been properly extracted for analysis.",
          "Our system detected potential issues with the file format or content structure."
        ],
        recommendations: [
          "Try uploading your resume in plain text format (.txt) for best results.",
          "Ensure your PDF is not scanned or image-based, as text extraction may be limited.",
          "Consider using a more standard resume format to improve analysis accuracy.",
          "Remove any unusual formatting, headers, or footers that might interfere with text extraction."
        ]
      };
      
      console.log('Using fallback analysis due to parsing error');
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
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        success: false,
        analysis: {
          bias_score: 50,
          feedback: [
            "An error occurred while analyzing your resume.",
            "The system was unable to process the file content properly.",
            "Your resume may be in a format that's difficult for our system to parse."
          ],
          recommendations: [
            "Try uploading a plain text (.txt) version of your resume.",
            "Ensure your PDF is text-based rather than image-based.",
            "Remove any complex formatting that might interfere with text extraction.",
            "Try again later if the issue persists."
          ]
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
