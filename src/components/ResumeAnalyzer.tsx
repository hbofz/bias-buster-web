
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Upload, AlertCircle, FileText, Cpu, CheckCircle, Clock, BarChart2, Award, BookOpen, GraduationCap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';
import { demoResumes } from '@/data/demoResumes';
import ResumeViewer from './ResumeViewer';
import { supabase } from '@/integrations/supabase/client';

// Helper function to read file content
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Calculate color based on score
const getScoreColor = (score: number): string => {
  if (score <= 50) return 'bg-green-500';
  if (score <= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Get the text color variant based on score
const getScoreTextColor = (score: number): string => {
  if (score <= 50) return 'text-green-600';
  if (score <= 70) return 'text-yellow-600';
  return 'text-red-600';
};

// Get the background color variant based on score
const getScoreBgColor = (score: number): string => {
  if (score <= 50) return 'bg-green-50';
  if (score <= 70) return 'bg-yellow-50';
  return 'bg-red-50';
};

// Generate explanation based on score
const getScoreExplanation = (score: number, scenarioId: string): string => {
  if (score <= 50) {
    return scenarioId === 'amazon' 
      ? 'Low risk - This resume contains language patterns that are unlikely to trigger gender bias in AI algorithms.'
      : 'Low risk - This resume contains elements that are unlikely to trigger socioeconomic bias in AI algorithms.';
  }
  if (score <= 70) {
    return scenarioId === 'amazon'
      ? 'Moderate risk - This resume contains some language patterns that might trigger gender bias in AI algorithms.'
      : 'Moderate risk - This resume contains some elements that might trigger socioeconomic bias in AI algorithms.';
  }
  return scenarioId === 'amazon'
    ? 'High risk - This resume contains several language patterns likely to trigger gender bias in AI algorithms.'
    : 'High risk - This resume contains several elements likely to trigger socioeconomic bias in AI algorithms.';
};

interface AnalysisResult {
  bias_score: number;
  feedback: string[];
}

interface ResumeAnalyzerState {
  file: File | null;
  fileContent: string;
  isAnalyzing: boolean;
  scenarioId: string;
  results: Record<string, AnalysisResult | null>;
  userFingerprint: string;
}

// Persistent state key
const STATE_STORAGE_KEY = 'resumeAnalyzerState';

const ResumeAnalyzer: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<ResumeAnalyzerState>({
    file: null,
    fileContent: '',
    isAnalyzing: false,
    scenarioId: 'amazon',
    results: {
      amazon: null,
      socioeconomic: null
    },
    userFingerprint: uuidv4(),
  });
  
  const [showDemoResume, setShowDemoResume] = useState<{isOpen: boolean; content: string; title: string; description?: string} | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STATE_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setState(prevState => ({
          ...prevState,
          fileContent: parsedState.fileContent || '',
          scenarioId: parsedState.scenarioId || 'amazon',
          results: parsedState.results || { amazon: null, socioeconomic: null },
          userFingerprint: parsedState.userFingerprint || uuidv4(),
        }));
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const stateToSave = {
        fileContent: state.fileContent,
        scenarioId: state.scenarioId,
        results: state.results,
        userFingerprint: state.userFingerprint,
      };
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [state.fileContent, state.scenarioId, state.results, state.userFingerprint]);
  
  // Clear state from localStorage on initial page load
  useEffect(() => {
    localStorage.removeItem(STATE_STORAGE_KEY);
  }, []);
  
  // Simulate progress during analysis
  useEffect(() => {
    if (state.isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          const increment = Math.random() * 15;
          const newValue = prev + increment;
          return newValue >= 95 ? 95 : newValue;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setAnalysisProgress(0);
    }
  }, [state.isAnalyzing]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (file.type !== 'text/plain') {
      toast({
        title: 'Invalid file format',
        description: 'Please upload a .txt file for best results.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const content = await readFileAsText(file);
      
      setState(prev => ({
        ...prev,
        file,
        fileContent: content,
        results: {
          amazon: null,
          socioeconomic: null
        }
      }));
      
      toast({
        title: 'Resume uploaded',
        description: 'Your resume has been successfully uploaded and is ready for analysis.',
      });
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: 'Error reading file',
        description: 'An error occurred while reading the file. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const analyzeResume = async () => {
    if (!state.fileContent) {
      toast({
        title: 'No resume to analyze',
        description: 'Please upload a resume or use a demo resume first.',
        variant: 'destructive',
      });
      return;
    }
    
    setState(prev => ({ ...prev, isAnalyzing: true }));
    setAnalysisProgress(0);
    
    try {
      // Using Supabase's functions.invoke instead of a direct fetch
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeText: state.fileContent,
          scenarioId: state.scenarioId,
          prompt: `Analyze this resume for ${state.scenarioId === 'amazon' ? 'gender bias' : 'socioeconomic bias'} potential`,
          userFingerprint: state.userFingerprint,
          filename: state.file?.name || 'demo-resume.txt',
        },
      });
      
      if (error) {
        throw new Error(error.message || 'Analysis failed');
      }
      
      if (data.success && data.analysis) {
        setAnalysisProgress(100);
        
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          results: {
            ...prev.results,
            [state.scenarioId]: data.analysis
          }
        }));
        
        toast({
          title: 'Analysis complete',
          description: 'Your resume has been analyzed for potential bias.',
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
      }));
      
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };
  
  const handleScenarioChange = (value: string) => {
    setState(prev => ({
      ...prev,
      scenarioId: value,
    }));
  };
  
  const useDemoResume = (type: 'male' | 'female' | 'privileged' | 'disadvantaged') => {
    const scenarioId = state.scenarioId;
    let content = '';
    
    if (scenarioId === 'amazon') {
      content = type === 'male' ? demoResumes.amazon.male : demoResumes.amazon.female;
    } else {
      content = type === 'privileged' ? demoResumes.socioeconomic.privileged : demoResumes.socioeconomic.disadvantaged;
    }
    
    setState(prev => ({
      ...prev,
      file: null,
      fileContent: content,
      results: {
        ...prev.results,
        [scenarioId]: null
      }
    }));
    
    toast({
      title: 'Demo resume loaded',
      description: `Using ${type} demo resume for ${scenarioId === 'amazon' ? 'gender bias' : 'socioeconomic bias'} analysis.`,
    });
  };
  
  const viewDemoResume = (type: 'male' | 'female' | 'privileged' | 'disadvantaged') => {
    const scenarioId = state.scenarioId;
    let content = '';
    let title = '';
    let description = '';
    
    if (scenarioId === 'amazon') {
      content = type === 'male' ? demoResumes.amazon.male : demoResumes.amazon.female;
      title = type === 'male' ? 'Male Demo Resume' : 'Female Demo Resume';
      description = 'This demo resume illustrates typical language patterns that might trigger gender bias in AI hiring algorithms.';
    } else {
      content = type === 'privileged' ? demoResumes.socioeconomic.privileged : demoResumes.socioeconomic.disadvantaged;
      title = type === 'privileged' ? 'Privileged Background Demo Resume' : 'Disadvantaged Background Demo Resume';
      description = 'This demo resume illustrates typical elements that might trigger socioeconomic bias in AI hiring algorithms.';
    }
    
    setShowDemoResume({
      isOpen: true,
      content,
      title,
      description
    });
  };
  
  const resetAnalysis = () => {
    setState(prev => ({
      ...prev,
      file: null,
      fileContent: '',
      results: {
        amazon: null,
        socioeconomic: null
      }
    }));
  };
  
  const currentResult = state.results[state.scenarioId];
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Tabs 
        defaultValue="amazon" 
        value={state.scenarioId}
        onValueChange={handleScenarioChange}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="amazon" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Historical Gender Bias (Amazon)
            </TabsTrigger>
            <TabsTrigger value="socioeconomic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Socioeconomic & Zip Code Bias
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" onClick={resetAnalysis} className="ml-auto">
            Reset
          </Button>
        </div>
        
        <TabsContent value="amazon" className="mt-0">
          <Card className="border bg-card shadow-card">
            <CardHeader>
              <CardTitle>Historical Gender Bias Analysis</CardTitle>
              <CardDescription>
                This simulation demonstrates how AI hiring algorithms can inadvertently perpetuate gender bias when trained on historical hiring data from predominantly male workforces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>How this works</AlertTitle>
                <AlertDescription>
                  Upload your resume (in .txt format) or use one of our demo resumes to see how AI hiring systems might evaluate your resume based on gender bias patterns. The analysis examines language patterns, terminology, and presentation that may trigger bias in algorithms.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Male Demo Resume</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contains masculine-coded language, competitive framing, and dominant terminology typical in male resumes.
                  </p>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Button onClick={() => useDemoResume('male')} className="w-full xs:w-auto">
                      Use This Resume
                    </Button>
                    <Button variant="outline" onClick={() => viewDemoResume('male')} className="w-full xs:w-auto">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Female Demo Resume</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contains more collaborative language, supportive framing, and feminine markers that may be penalized.
                  </p>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Button onClick={() => useDemoResume('female')} className="w-full xs:w-auto">
                      Use This Resume
                    </Button>
                    <Button variant="outline" onClick={() => viewDemoResume('female')} className="w-full xs:w-auto">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-dashed rounded-lg p-6 text-center">
                <div className="mb-4">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">Upload Your Own Resume</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a .txt file for best results
                  </p>
                </div>
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                    className="w-full sm:w-auto"
                  >
                    Choose File
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                {state.file && (
                  <div className="mt-4 text-sm">
                    <Badge variant="outline" className="px-3 py-1">
                      {state.file.name}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="socioeconomic" className="mt-0">
          <Card className="border bg-card shadow-card">
            <CardHeader>
              <CardTitle>Socioeconomic Bias Analysis</CardTitle>
              <CardDescription>
                This simulation demonstrates how AI hiring algorithms can inadvertently discriminate based on socioeconomic indicators like zip codes, school names, and activities that signal privilege.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>How this works</AlertTitle>
                <AlertDescription>
                  Upload your resume (in .txt format) or use one of our demo resumes to see how AI hiring systems might evaluate your resume based on socioeconomic indicators. The analysis examines school names, addresses, activities, and other signals that may correlate with socioeconomic status.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Privileged Background Demo</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contains elite schools, wealthy zip codes, prestigious internships, and activities requiring financial resources.
                  </p>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Button onClick={() => useDemoResume('privileged')} className="w-full xs:w-auto">
                      Use This Resume
                    </Button>
                    <Button variant="outline" onClick={() => viewDemoResume('privileged')} className="w-full xs:w-auto">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Disadvantaged Background Demo</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Contains less prestigious schools, lower-income neighborhoods, work experience during education, and community-focused activities.
                  </p>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Button onClick={() => useDemoResume('disadvantaged')} className="w-full xs:w-auto">
                      Use This Resume
                    </Button>
                    <Button variant="outline" onClick={() => viewDemoResume('disadvantaged')} className="w-full xs:w-auto">
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-dashed rounded-lg p-6 text-center">
                <div className="mb-4">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">Upload Your Own Resume</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a .txt file for best results
                  </p>
                </div>
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                    className="w-full sm:w-auto"
                  >
                    Choose File
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                {state.file && (
                  <div className="mt-4 text-sm">
                    <Badge variant="outline" className="px-3 py-1">
                      {state.file.name}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {state.fileContent && (
        <Card className="border shadow-card overflow-hidden bg-gradient-to-br from-background to-muted/10">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 via-background to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Resume Analysis
            </CardTitle>
            <CardDescription>
              {state.scenarioId === 'amazon' 
                ? 'Analyzing resume for potential gender bias triggers in AI hiring algorithms'
                : 'Analyzing resume for potential socioeconomic bias triggers in AI hiring algorithms'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {state.isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Analyzing resume...</span>
                  <span className="text-sm">{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <div className="bg-muted/30 p-6 rounded-md animate-pulse border">
                  <div className="flex items-start gap-3">
                    <Cpu className="h-6 w-6 text-primary/70 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm mb-2">AI Analysis in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI is examining your resume for potential bias triggers, analyzing:
                      </p>
                      <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Language patterns and terminology</span>
                        </li>
                        <li className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Educational credentials presentation</span>
                        </li>
                        <li className="flex items-center">
                          <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Achievement descriptions and highlights</span>
                        </li>
                        <li className="flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Indicators of privilege or disadvantage</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentResult ? (
              <div className="space-y-6 animate-slide-in">
                <div className={`${getScoreBgColor(currentResult.bias_score)} p-6 rounded-lg border shadow-sm`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getScoreTextColor(currentResult.bias_score)} bg-white shadow-sm font-bold text-xl mr-4`}>
                        {currentResult.bias_score}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Bias Risk Score</h3>
                        <p className={`text-sm ${getScoreTextColor(currentResult.bias_score)} font-medium`}>
                          {currentResult.bias_score <= 50 ? 'Low Risk' : currentResult.bias_score <= 70 ? 'Moderate Risk' : 'High Risk'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {currentResult.bias_score <= 50 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <span className="text-sm font-medium">
                        {getScoreExplanation(currentResult.bias_score, state.scenarioId)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="mb-2 text-xs font-medium flex justify-between">
                      <span>Low Algorithmic Bias Risk</span>
                      <span>High Algorithmic Bias Risk</span>
                    </div>
                    <div className="h-2 mb-4 flex rounded-full bg-gray-200 overflow-hidden">
                      <div
                        style={{ width: `${currentResult.bias_score}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-in-out ${getScoreColor(currentResult.bias_score)}`}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Potential Bias Triggers Identified
                  </h3>
                  
                  {currentResult.feedback.length > 0 ? (
                    <div className="space-y-4">
                      {currentResult.feedback.map((item, index) => (
                        <div key={index} className="p-4 border rounded-md bg-amber-50/50 hover:bg-amber-50 transition-colors">
                          <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm">{item}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {state.scenarioId === 'amazon' 
                                  ? 'This pattern may be interpreted differently based on gender stereotypes by hiring algorithms.'
                                  : 'This element may signal socioeconomic background to hiring algorithms using pattern matching.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific bias triggers were identified in the resume.</p>
                  )}
                </div>
                
                <div className="bg-gradient-to-r from-primary/5 via-background to-primary/5 p-6 rounded-lg border">
                  <h3 className="font-medium mb-3">AI Analysis Summary</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {state.scenarioId === 'amazon'
                      ? 'Our AI has analyzed your resume for language patterns that might trigger gender bias in hiring algorithms. The analysis focused on action verbs, achievement descriptions, and gender indicators that could influence automated screening.'
                      : 'Our AI has analyzed your resume for elements that might trigger socioeconomic bias in hiring algorithms. The analysis focused on educational institutions, address information, and activities that could indicate socioeconomic background.'
                    }
                  </p>
                  <Button onClick={analyzeResume} className="w-full bg-gradient-to-r from-primary to-primary/90 hover:shadow-md transition-all">
                    <Cpu className="mr-2 h-4 w-4" />
                    Re-Analyze Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <Button onClick={analyzeResume} size="lg" className="animate-pulse bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl transition-all px-8 py-6">
                  <Cpu className="mr-3 h-5 w-5" />
                  <span className="text-lg">Start Analysis</span>
                </Button>
                <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                  Click to analyze the resume for potential {state.scenarioId === 'amazon' ? 'gender' : 'socioeconomic'} bias patterns that might affect your chances in automated hiring systems
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {showDemoResume && (
        <ResumeViewer
          isOpen={showDemoResume.isOpen}
          onClose={() => setShowDemoResume(null)}
          resumeText={showDemoResume.content}
          title={showDemoResume.title}
          description={showDemoResume.description}
        />
      )}
    </div>
  );
};

export default ResumeAnalyzer;
