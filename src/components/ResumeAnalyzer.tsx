
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CASE_SCENARIOS = [
  {
    id: "amazon",
    name: "Amazon's AI Recruiting Tool",
    description: "This model simulates the historical bias of Amazon's AI recruiting tool that favored male candidates.",
    prompt: "Analyze this resume as if you were Amazon's biased AI recruiting tool from 2018. The tool was trained on 10 years of resumes, mostly from men, creating a bias against female candidates. Identify elements that might trigger gender bias.",
  },
  {
    id: "hirevue",
    name: "HireVue's Facial Analysis",
    description: "This scenario simulates potential biases in facial analysis and language pattern systems.",
    prompt: "Evaluate this resume as if you were applying HireVue's interview analysis system. Consider how language patterns, work history presentation, and technical vs. soft skills emphasis might introduce bias.",
  },
  {
    id: "keyword",
    name: "Keyword-Based ATS",
    description: "This scenario simulates basic ATS systems that rely heavily on keyword matching.",
    prompt: "Review this resume as if you were a keyword-based Applicant Tracking System looking for tech industry candidates. Analyze how the terminology, formatting, and credential presentation might create bias based on educational background or previous employer prestige.",
  }
];

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeScenario, setActiveScenario] = useState("amazon");
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check if the file is a PDF or DOCX
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAnalyze = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout
    setTimeout(() => {
      // Generate mock analysis results based on the selected scenario
      const mockResults = generateMockResults(activeScenario);
      setResults(mockResults);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed for potential algorithmic bias",
      });
    }, 3000);
  };
  
  const generateMockResults = (scenarioId: string) => {
    // Different bias patterns for different scenarios
    const biasScores = {
      amazon: Math.random() * 50 + 30, // 30-80 range
      hirevue: Math.random() * 40 + 20, // 20-60 range
      keyword: Math.random() * 70 + 10, // 10-80 range
    };
    
    const feedbackOptions = {
      amazon: [
        "Technical terms commonly associated with male candidates were detected",
        "Leadership terms are presented in ways historically favored by the algorithm",
        "Resume structure matches patterns the system was trained to prefer",
        "Education background from institutions with historical gender imbalance"
      ],
      hirevue: [
        "Communication style indicators suggest potential bias in interview scenarios",
        "Technical vs. soft skills balance may trigger evaluation patterns",
        "Career progression narrative follows patterns that may influence scoring",
        "Academic credentials presented in formats that historically influence outcomes"
      ],
      keyword: [
        "Industry-specific terminology density varies from algorithmic preferences",
        "Credential formatting may not optimize for automated parsing",
        "Job title conventions may influence categorization by the system",
        "Duration patterns in work history may trigger algorithmic preferences"
      ]
    };
    
    // Generate 2-3 random feedback items
    const numFeedback = Math.floor(Math.random() * 2) + 2; // 2-3 items
    const feedbackPool = feedbackOptions[scenarioId as keyof typeof feedbackOptions];
    const selectedFeedback = [];
    
    for (let i = 0; i < numFeedback; i++) {
      const randomIndex = Math.floor(Math.random() * feedbackPool.length);
      selectedFeedback.push(feedbackPool[randomIndex]);
      // Remove selected item to avoid duplicates
      feedbackPool.splice(randomIndex, 1);
    }
    
    return {
      biasScore: biasScores[scenarioId as keyof typeof biasScores],
      feedback: selectedFeedback,
      recommendations: [
        "Revise terminology to be more balanced and inclusive",
        "Restructure achievement descriptions to avoid pattern-matching bias",
        "Consider alternative formatting to reduce algorithmic preferences",
        "Include diverse skill representations to counterbalance potential biases"
      ]
    };
  };
  
  const resetAnalysis = () => {
    setFile(null);
    setResults(null);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto opacity-0 animate-fade-in-up">
      <CardHeader>
        <CardTitle>Resume Bias Analyzer</CardTitle>
        <CardDescription>
          Upload your resume to see how it might be evaluated by different AI hiring systems.
          This simulation demonstrates potential algorithmic biases in hiring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="amazon" onValueChange={setActiveScenario}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            {CASE_SCENARIOS.map(scenario => (
              <TabsTrigger key={scenario.id} value={scenario.id}>{scenario.name}</TabsTrigger>
            ))}
          </TabsList>
          
          {CASE_SCENARIOS.map(scenario => (
            <TabsContent key={scenario.id} value={scenario.id} className="space-y-4">
              <div className="p-4 border rounded-md bg-secondary/50">
                <h3 className="font-medium mb-2">Scenario:</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>
              
              {!results ? (
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="resume">Upload your resume</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="resume" 
                        type="file" 
                        accept=".pdf,.docx" 
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOCX</p>
                  </div>
                  
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <CheckCircle size={16} />
                      <span>{file.name}</span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!file || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                  </Button>
                  
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Processing resume...</span>
                        <span>This may take a moment</span>
                      </div>
                      <Progress value={Math.random() * 100} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Bias Score:</h3>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                            {results.biasScore < 30 ? "Low" : results.biasScore < 60 ? "Medium" : "High"} Potential Bias
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block">
                            {Math.round(results.biasScore)}/100
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/10">
                        <div style={{ width: `${results.biasScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Potential Bias Indicators:</h3>
                    <ul className="space-y-2">
                      {results.feedback.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 items-start">
                          <AlertCircle size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Recommendations:</h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((item: string, i: number) => (
                        <li key={i} className="flex gap-2 items-start">
                          <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" onClick={resetAnalysis}>
                      Analyze Another Resume
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6 text-xs text-muted-foreground">
        <div>This is a simulation for educational purposes only.</div>
        <div>No data is stored or shared.</div>
      </CardFooter>
    </Card>
  );
};

export default ResumeAnalyzer;
