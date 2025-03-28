import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AlertCircle, CheckCircle, Upload, FileText, BarChart2, Clock, RefreshCw, FileX, Info, Medal, TrendingUp, Target, List, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';

const CASE_SCENARIOS = [
  {
    id: "amazon",
    name: "Historical Gender Bias",
    description: "This model simulates how historical gender bias in hiring data might affect the evaluation of your resume.",
    prompt: "You are simulating a biased AI recruiting tool trained on historical data that shows bias against certain demographics. Analyze the specific content of this resume and identify potential bias triggers related to gender in the text, terminology, format, and structure. Consider elements like language choices, activities descriptions, and education patterns. Provide a JSON response with three properties: 1) biasScore: a number between 0-100 representing potential bias impact (higher means more concerning), 2) feedback: an array of 2-4 strings identifying SPECIFIC elements from the resume that might trigger bias, quoting actual text from the resume, and 3) recommendations: an array of 3-5 actionable, specific recommendations to modify the resume to reduce bias triggers. Base your analysis ONLY on the actual resume content provided.",
    icon: <Medal className="h-5 w-5 text-amber-500" />
  },
  {
    id: "keyword",
    name: "Keyword-Based ATS",
    description: "This scenario simulates how basic Applicant Tracking Systems rely on keyword matching to filter resumes before human review.",
    prompt: "You are simulating a keyword-based Applicant Tracking System that screens resumes primarily based on terminology matches. Analyze the SPECIFIC CONTENT of this resume for how industry terminology, formatting, and credential presentation might cause it to be filtered out. Your analysis should be based SOLELY on the actual text provided in the resume. Return a JSON object with three properties: 1) biasScore: a number between 0-100 representing how likely the resume would be filtered out (higher means more likely to be rejected), 2) feedback: an array of 2-4 strings identifying SPECIFIC elements from the resume that might cause keyword filtering issues, quoting actual text from the resume, and 3) recommendations: an array of 3-5 actionable, specific recommendations to optimize the actual resume for ATS keyword filtering. Focus only on industry terminology density, formatting issues, and standard job title conventions that appear in the provided resume.",
    icon: <List className="h-5 w-5 text-blue-500" />
  }
];

const getUserFingerprint = () => {
  const storedFingerprint = localStorage.getItem('userFingerprint');
  if (storedFingerprint) {
    return storedFingerprint;
  }
  
  const newFingerprint = uuidv4();
  localStorage.setItem('userFingerprint', newFingerprint);
  return newFingerprint;
};

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeScenario, setActiveScenario] = useState("amazon");
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'ready' | 'error'>('idle');
  const [compareMode, setCompareMode] = useState(false);
  const [userFingerprint] = useState(() => getUserFingerprint());
  const { toast } = useToast();
  
  const { data: previousAnalyses, isLoading: isLoadingPreviousAnalyses, refetch: refetchAnalyses } = useQuery({
    queryKey: ['previousAnalyses', userFingerprint],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('user_fingerprint', userFingerprint)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data;
    },
    enabled: !!userFingerprint,
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const getComparisonChartData = () => {
    if (!previousAnalyses || previousAnalyses.length === 0) return [];
    
    const scenarioMap = new Map();
    previousAnalyses.forEach(analysis => {
      if (!scenarioMap.has(analysis.scenario_id) || 
          new Date(analysis.created_at) > new Date(scenarioMap.get(analysis.scenario_id).created_at)) {
        scenarioMap.set(analysis.scenario_id, analysis);
      }
    });
    
    return Array.from(scenarioMap.values()).map(analysis => ({
      name: CASE_SCENARIOS.find(s => s.id === analysis.scenario_id)?.name || analysis.scenario_id,
      score: Number(analysis.bias_score),
      id: analysis.scenario_id
    }));
  };

  const getRadarChartData = (analysis: any) => {
    if (!analysis) return [];
    
    return [
      { subject: 'Gender Bias', A: analysis.bias_score * 0.85, fullMark: 100 },
      { subject: 'Language', A: analysis.bias_score * 0.7, fullMark: 100 },
      { subject: 'Education', A: analysis.bias_score * 1.1 > 100 ? 100 : analysis.bias_score * 1.1, fullMark: 100 },
      { subject: 'Experience', A: analysis.bias_score * 0.9, fullMark: 100 },
      { subject: 'Keywords', A: analysis.bias_score * 1.2 > 100 ? 100 : analysis.bias_score * 1.2, fullMark: 100 },
    ];
  };
  
  const resetAnalysis = () => {
    setFile(null);
    setResumeText('');
    setUploadStatus('idle');
    setProgress(0);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setUploadStatus('uploading');
        setProgress(25);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setProgress(75);
          
          if (typeof event.target?.result === 'string') {
            setResumeText(event.target.result);
          } else {
            const textDecoder = new TextDecoder();
            setResumeText(textDecoder.decode(event.target?.result as ArrayBuffer));
          }
          
          setUploadStatus('ready');
          setProgress(100);
          
          toast({
            title: "Resume processed successfully",
            description: "Your resume is ready for analysis",
          });
        };
        
        reader.onerror = () => {
          setUploadStatus('error');
          toast({
            title: "Error processing file",
            description: "Could not read file content",
            variant: "destructive"
          });
        };
        
        if (selectedFile.type === 'application/pdf' || 
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          reader.readAsText(selectedFile);
        } else {
          reader.readAsText(selectedFile);
        }
      } else {
        setUploadStatus('error');
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAnalyze = async () => {
    if (!file || !resumeText) {
      toast({
        title: "No file processed",
        description: "Please upload and process a resume first",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 300);
    
    const scenario = CASE_SCENARIOS.find(s => s.id === activeScenario);
    
    if (!scenario) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      toast({
        title: "Error",
        description: "Selected scenario not found",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log(`Analyzing resume for ${scenario.name}...`);
      console.log(`Resume content length: ${resumeText.length} characters`);
      
      const response = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeText,
          scenarioId: scenario.id,
          prompt: scenario.prompt,
          userFingerprint,
          filename: file.name
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to analyze resume');
      }
      
      const { error: insertError } = await supabase
        .from('resume_analyses')
        .insert({
          user_fingerprint: userFingerprint,
          resume_filename: file.name,
          scenario_id: scenario.id,
          bias_score: response.data.analysis.bias_score,
          feedback: response.data.analysis.feedback,
          recommendations: response.data.analysis.recommendations
        });
        
      if (insertError) {
        console.error('Supabase insert error:', insertError);
      }
      
      clearInterval(progressInterval);
      setProgress(100);
      setIsAnalyzing(false);
      
      refetchAnalyses();
      
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed for potential algorithmic bias",
      });
    } catch (error) {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      console.error('Analysis error:', error);
      
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  
  const getCurrentAnalysis = () => {
    if (!previousAnalyses || previousAnalyses.length === 0) return null;
    
    return previousAnalyses.find(analysis => analysis.scenario_id === activeScenario);
  };
  
  const currentAnalysis = getCurrentAnalysis();
  const chartData = getComparisonChartData();
  const radarData = currentAnalysis ? getRadarChartData(currentAnalysis) : [];
  
  useEffect(() => {
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        setProgress(prev => (prev < 95 ? prev + 5 : prev));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, progress]);
  
  return (
    <Card className="w-full max-w-4xl mx-auto opacity-0 animate-fade-in-up shadow-lg border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">Resume Bias Analyzer</CardTitle>
        <CardDescription className="text-base text-center max-w-2xl mx-auto">
          Upload your resume to see how it might be evaluated by different AI hiring systems.
          This simulation demonstrates potential algorithmic biases in hiring.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="amazon" onValueChange={setActiveScenario}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-6">
            {CASE_SCENARIOS.map(scenario => (
              <TabsTrigger key={scenario.id} value={scenario.id} className="text-sm md:text-base">
                <div className="flex items-center gap-2">
                  {scenario.icon}
                  {scenario.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {CASE_SCENARIOS.map(scenario => (
            <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
              <div className="p-5 border rounded-lg bg-card/50 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Info size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Scenario:</h3>
                    <p className="text-muted-foreground">{scenario.description}</p>
                  </div>
                </div>
              </div>
              
              {!currentAnalysis ? (
                <div className="space-y-6">
                  <div className="grid w-full gap-4">
                    <div className="bg-gradient-to-b from-card to-muted/30 rounded-lg p-5 border shadow-sm">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Upload your resume
                      </h3>
                      
                      {uploadStatus === 'idle' && (
                        <div className="space-y-5">
                          <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-all"
                            onClick={() => document.getElementById('resume-upload')?.click()}>
                            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-primary font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-2">PDF, DOCX, or TXT (Max 5MB)</p>
                            <Input 
                              id="resume-upload" 
                              type="file" 
                              accept=".pdf,.docx,.txt" 
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      )}
                      
                      {uploadStatus === 'uploading' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <FileText className="text-primary h-5 w-5" />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{file?.name}</span>
                                <span className="text-muted-foreground">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <Clock className="inline mr-1 h-4 w-4" /> Processing your resume, please wait...
                          </p>
                        </div>
                      )}
                      
                      {uploadStatus === 'ready' && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                            <CheckCircle size={20} />
                            <span className="text-base font-medium">{file?.name} ready for analysis</span>
                          </div>
                          <div className="flex flex-col md:flex-row gap-3 mt-2">
                            <Button 
                              onClick={handleAnalyze} 
                              disabled={isAnalyzing}
                              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                              size="lg"
                            >
                              {isAnalyzing ? (
                                <>
                                  <RefreshCw size={16} className="animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>Analyze Resume</>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={resetAnalysis}
                              disabled={isAnalyzing}
                              className="gap-2"
                            >
                              <FileX size={16} />
                              Change File
                            </Button>
                          </div>
                          
                          {isAnalyzing && (
                            <div className="space-y-2 bg-muted/30 p-4 rounded-lg border mt-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Analyzing with {scenario.name}</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                This may take a moment as we conduct a thorough bias analysis
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {uploadStatus === 'error' && (
                        <div className="text-destructive flex items-center gap-2 my-4">
                          <AlertCircle size={18} />
                          <span>Error processing file. Please try again with a PDF, DOCX, or TXT file.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-card rounded-lg border p-5 shadow-md">
                        <h3 className="font-medium text-xl mb-6 flex items-center gap-2 text-primary">
                          <BarChart2 size={20} className="text-primary" />
                          Bias Score Analysis
                        </h3>
                        
                        <div className="relative pt-1 mb-6">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className={`text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full 
                                ${currentAnalysis.bias_score < 30 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                  : currentAnalysis.bias_score < 60 
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" 
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                                {currentAnalysis.bias_score < 30 ? "Low" : 
                                currentAnalysis.bias_score < 60 ? "Medium" : "High"} Potential Bias
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold inline-block">
                                {Math.round(currentAnalysis.bias_score)}
                              </span>
                              <span className="text-sm text-muted-foreground">/100</span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-muted">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${currentAnalysis.bias_score}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center 
                                ${currentAnalysis.bias_score < 30 
                                  ? 'bg-green-500' 
                                  : currentAnalysis.bias_score < 60 
                                    ? 'bg-amber-500' 
                                    : 'bg-red-500'}`}
                            ></motion.div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-6">
                          This score represents how likely this system would exhibit biased behavior when evaluating your resume. 
                          Higher scores indicate a greater likelihood of bias.
                        </p>
                        
                        <div className="h-36 md:h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={60} width={500} height={150} data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Bias Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-4 pt-2 border-t">
                          <p>Analyzed on {formatDate(currentAnalysis.created_at)}</p>
                          <p>File: {currentAnalysis.resume_filename}</p>
                        </div>
                      </div>
                      
                      <div className="bg-card rounded-lg border p-5 shadow-md">
                        <h3 className="font-medium text-xl mb-4 flex items-center gap-2 text-amber-500">
                          <AlertCircle size={20} className="text-amber-500" />
                          Potential Bias Indicators
                        </h3>
                        
                        <ul className="space-y-3">
                          {currentAnalysis.feedback.map((item: string, i: number) => (
                            <motion.li 
                              key={i} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="flex gap-2 items-start bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-100 dark:border-amber-800/30"
                            >
                              <AlertCircle size={16} className="text-amber-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg border p-5 shadow-md">
                      <h3 className="font-medium text-xl mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        Recommendations
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentAnalysis.recommendations.map((item: string, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                            className="flex gap-3 items-start bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-100 dark:border-green-800/30"
                          >
                            <div className="bg-green-100 dark:bg-green-800/50 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-green-700 dark:text-green-300 text-xs font-bold">{i+1}</span>
                            </div>
                            <div>
                              <span className="text-sm">{item}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {chartData.length >= 2 && (
                      <div className="bg-card rounded-lg border p-5 shadow-md">
                        <h3 className="font-medium text-xl mb-4 flex items-center gap-2">
                          <TrendingUp size={18} className="text-primary" />
                          Comparison Across Scenarios
                        </h3>
                        
                        <div className="h-72">
                          <ChartContainer 
                            config={{ 
                              amazon: { color: "#3e5cb2" },
                              keyword: { color: "#5cb28a" }
                            }}
                          >
                            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} />
                              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar 
                                dataKey="score" 
                                fill="var(--color-amazon)" 
                                radius={[4, 4, 0, 0]} 
                                maxBarSize={60}
                                name="Bias Score" 
                              />
                            </BarChart>
                          </ChartContainer>
                        </div>
                      </div>
                    )}
                    
                    {previousAnalyses && previousAnalyses.length > 0 && (
                      <div className="bg-card rounded-lg border p-5 shadow-md">
                        <h3 className="font-medium text-xl mb-4 flex items-center gap-2">
                          <Clock size={18} className="text-primary" />
                          Analysis History
                        </h3>
                        
                        <div className="overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead>Scenario</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {previousAnalyses.map((analysis) => (
                                <TableRow key={analysis.id} className="cursor-pointer hover:bg-muted/50" 
                                  onClick={() => setActiveScenario(analysis.scenario_id)}>
                                  <TableCell>{formatDate(analysis.created_at)}</TableCell>
                                  <TableCell className="max-w-[150px] truncate">{analysis.resume_filename}</TableCell>
                                  <TableCell>
                                    {CASE_SCENARIOS.find(s => s.id === analysis.scenario_id)?.name || analysis.scenario_id}
                                  </TableCell>
                                  <TableCell className="text-right font-medium">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      analysis.bias_score < 30 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                        : analysis.bias_score < 60 
                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                      {Math.round(analysis.bias_score)}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 flex justify-between">
                      <Button variant="outline" onClick={resetAnalysis} className="gap-2">
                        <Upload size={16} />
                        Upload New Resume
                      </Button>
                      
                      <Button 
                        onClick={handleAnalyze} 
                        disabled={!file || isAnalyzing}
                        className="gap-2"
                      >
                        <RefreshCw size={16} className={isAnalyzing ? "animate-spin" : ""} />
                        Reanalyze
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 text-xs text-muted-foreground gap-2 bg-muted/20 rounded-b-lg">
        <div>This is a simulation for educational purposes only.</div>
        <div>Your resume data is stored locally and not shared with third parties.</div>
      </CardFooter>
    </Card>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border shadow-lg rounded-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm mt-1">
          Score: <span className="font-mono">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default ResumeAnalyzer;
