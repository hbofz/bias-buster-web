
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CircleHelp, Code, Database, Eye, EyeOff, Filter, FlaskConical, Search, Shuffle, AlertCircle, ArrowRight, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const BiasExplanation: React.FC = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [activeBiasType, setActiveBiasType] = useState("historical");
  const [visibleExample, setVisibleExample] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState(1);
  const [showBias, setShowBias] = useState(false);
  const [useMobileDrawer, setUseMobileDrawer] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setUseMobileDrawer(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const biasTypes = [
    {
      id: "historical",
      title: "Historical Bias",
      description: "When AI is trained on past hiring data that reflects historical discrimination, it learns and perpetuates these patterns.",
      example: "If tech companies historically hired more men than women, an AI model trained on this data will favor male candidates even if gender is not an explicit factor.",
      icon: <Database className="h-5 w-5" />,
      color: "from-orange-500/20 to-red-500/20",
      visual: (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0.5 p-2">
            {Array.from({ length: 100 }).map((_, i) => {
              const isMale = i < 70;
              const isHighlighted = showBias && isMale;
              return (
                <div 
                  key={i}
                  className={cn(
                    "rounded transition-colors duration-500",
                    isMale ? "bg-blue-400/20" : "bg-pink-400/20",
                    isHighlighted && "bg-blue-500/70"
                  )}
                />
              );
            })}
          </div>
          <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
            <div className="flex justify-between font-mono">
              <div>Historical data: 70% male hires</div>
              <div>30% female hires</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "representation",
      title: "Representation Bias",
      description: "Occurs when the data used to train AI doesn't adequately represent all demographic groups in the population.",
      example: "If training data overrepresents certain ethnic groups or underrepresents others, the algorithm may perform better for majority groups and worse for minorities.",
      icon: <Search className="h-5 w-5" />,
      color: "from-blue-500/20 to-purple-500/20",
      visual: (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0.5 p-2">
            {Array.from({ length: 100 }).map((_, i) => {
              const isGroupA = i < 85;
              const isLearned = showBias && (isGroupA ? Math.random() > 0.2 : Math.random() > 0.8);
              return (
                <div 
                  key={i}
                  className={cn(
                    "rounded transition-colors duration-300",
                    isGroupA ? "bg-blue-400/20" : "bg-green-400/20",
                    isLearned && (isGroupA ? "bg-blue-500/70" : "bg-green-500/70")
                  )}
                />
              );
            })}
          </div>
          <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs">
            <div className="flex justify-between font-mono">
              <div>85% Group A data samples</div>
              <div>15% Group B</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "measurement",
      title: "Measurement Bias",
      description: "Occurs when the features selected to represent a concept are better proxies for some groups than others.",
      example: "Using years of continuous employment as a proxy for reliability may disadvantage women who take parental leave or people with health conditions requiring medical leave.",
      icon: <FlaskConical className="h-5 w-5" />,
      color: "from-green-500/20 to-teal-500/20",
      visual: (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 flex flex-col p-4">
            <div className="text-xs text-center mb-2 font-mono">Measurement: Years of Continuous Employment</div>
            <div className="flex-1 flex items-end pb-8">
              <div className="w-1/4 bg-blue-400/20 h-full relative group">
                {showBias && (
                  <motion.div 
                    className="absolute inset-x-0 bottom-0 bg-blue-500/70"
                    initial={{ height: 0 }}
                    animate={{ height: '90%' }}
                    transition={{ duration: 1 }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 text-xs text-center">Group A</div>
              </div>
              <div className="w-1/4 bg-pink-400/20 h-full relative">
                {showBias && (
                  <motion.div 
                    className="absolute inset-x-0 bottom-0 bg-pink-500/70"
                    initial={{ height: 0 }}
                    animate={{ height: '40%' }}
                    transition={{ duration: 1 }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 text-xs text-center">Group B</div>
              </div>
              <div className="w-1/4 bg-yellow-400/20 h-full relative">
                {showBias && (
                  <motion.div 
                    className="absolute inset-x-0 bottom-0 bg-yellow-500/70"
                    initial={{ height: 0 }}
                    animate={{ height: '60%' }}
                    transition={{ duration: 1 }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 text-xs text-center">Group C</div>
              </div>
              <div className="w-1/4 bg-green-400/20 h-full relative">
                {showBias && (
                  <motion.div 
                    className="absolute inset-x-0 bottom-0 bg-green-500/70"
                    initial={{ height: 0 }}
                    animate={{ height: '45%' }}
                    transition={{ duration: 1 }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 text-xs text-center">Group D</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "aggregation",
      title: "Aggregation Bias",
      description: "Occurs when models are applied across different populations without accounting for how relationships between variables might differ between groups.",
      example: "An algorithm that works well for evaluating candidates from large urban universities might perform poorly when assessing candidates from rural community colleges with different educational structures.",
      icon: <Shuffle className="h-5 w-5" />,
      color: "from-purple-500/20 to-pink-500/20",
      visual: (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 flex justify-center items-center p-4">
            <div className="w-full max-w-xs">
              <div className="text-xs text-center mb-4 font-mono">Same Model Applied to Different Groups</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-center text-xs">Group 1</div>
                  {showBias ? (
                    <div className="h-20 bg-gradient-to-r from-green-500/70 to-green-500/20 rounded flex items-center justify-center text-xs">
                      95% Accuracy
                    </div>
                  ) : (
                    <div className="h-20 bg-gray-200/50 rounded"></div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-center text-xs">Group 2</div>
                  {showBias ? (
                    <div className="h-20 bg-gradient-to-r from-red-500/70 to-red-500/20 rounded flex items-center justify-center text-xs">
                      62% Accuracy
                    </div>
                  ) : (
                    <div className="h-20 bg-gray-200/50 rounded"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "proxy",
      title: "Proxy Variable Bias",
      description: "Even when protected attributes like race or gender are removed, algorithms can find proxy variables that correlate with them.",
      example: "A zip code can be a proxy for race due to historical housing segregation. School names can be proxies for socioeconomic status or gender (e.g., women's colleges).",
      icon: <Filter className="h-5 w-5" />,
      color: "from-yellow-500/20 to-orange-500/20",
      visual: (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 flex flex-col p-4">
            <div className="text-xs text-center mb-2 font-mono">Direct vs. Proxy Variables</div>
            <div className="flex-1 flex items-center justify-center">
              {!showBias ? (
                <div className="p-4 border border-dashed rounded-md text-center space-y-2">
                  <div className="text-xs">Variables Used in Model</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">Zip Code</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">School Name</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">Experience</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">Hobbies</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-md text-center space-y-4 w-full">
                  <div className="text-xs">Correlation with Protected Attributes</div>
                  <div className="space-y-2 w-full">
                    <div className="flex items-center text-xs">
                      <span className="w-24 text-left">Zip Code</span>
                      <div className="h-2 flex-1 bg-gray-200 rounded-full">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="w-16 text-right">85% Race</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-24 text-left">School Name</span>
                      <div className="h-2 flex-1 bg-gray-200 rounded-full">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="w-16 text-right">70% Gender</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-24 text-left">Hobbies</span>
                      <div className="h-2 flex-1 bg-gray-200 rounded-full">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="w-16 text-right">65% Class</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      id: "algorithm",
      title: "Algorithm Design Bias",
      description: "The choices made in constructing an algorithm, such as optimization objectives or model architecture, can introduce bias.",
      example: "If an algorithm is designed to optimize for technical skills alone while ignoring collaborative abilities, it might systematically disadvantage candidates whose strengths are in team-building.",
      icon: <Code className="h-5 w-5" />,
      color: "from-cyan-500/20 to-blue-500/20",
      visual: (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <div className="absolute inset-0 flex flex-col p-4">
            <div className="text-xs text-center mb-2 font-mono">Algorithm Design: Feature Weights</div>
            <div className="flex-1 flex items-center justify-center">
              {!showBias ? (
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Technical Skills</div>
                    <div className="h-3 flex-1 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Communication</div>
                    <div className="h-3 flex-1 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Leadership</div>
                    <div className="h-3 flex-1 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Teamwork</div>
                    <div className="h-3 flex-1 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Technical Skills</div>
                    <div className="h-3 flex-1 bg-blue-500 rounded"></div>
                    <div className="w-8 text-right">70%</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Communication</div>
                    <div className="h-3 w-1/4 bg-blue-300 rounded"></div>
                    <div className="w-8 text-right">15%</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Leadership</div>
                    <div className="h-3 w-1/6 bg-blue-200 rounded"></div>
                    <div className="w-8 text-right">10%</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-32">Teamwork</div>
                    <div className="h-3 w-1/12 bg-blue-100 rounded"></div>
                    <div className="w-8 text-right">5%</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];

  const stages = [
    {
      id: 1,
      title: "Data Collection",
      description: "The initial process of gathering historical hiring data that will be used to train the AI system.",
      biases: ["Historical bias can enter here if past hiring practices were discriminatory.", 
               "Representation bias occurs if certain groups are underrepresented in the training data."],
      example: "A company's historical hiring records may contain mostly successful male candidates for technical roles if the company had gender-biased hiring in the past."
    },
    {
      id: 2,
      title: "Feature Selection",
      description: "Determining which attributes from candidate profiles will be used by the algorithm.",
      biases: ["Proxy variable bias can emerge if selected features correlate with protected characteristics.",
               "Measurement bias can occur if chosen metrics advantage certain groups."],
      example: "Selecting 'years of continuous employment' as a feature disadvantages those who take career breaks for caregiving, disproportionately affecting women."
    },
    {
      id: 3,
      title: "Model Training",
      description: "The process of training the AI algorithm on the selected data and features.",
      biases: ["Aggregation bias emerges when models don't account for differences between population groups.",
               "Algorithm design bias occurs through choices in optimization objectives and model structure."],
      example: "An algorithm might be trained to prioritize candidates similar to currently 'successful' employees, perpetuating existing demographic imbalances."
    },
    {
      id: 4,
      title: "Decision Making",
      description: "How the model ultimately evaluates candidates and makes or influences hiring decisions.",
      biases: ["Interpretation bias can occur when model outputs are misinterpreted or given inappropriate weight.",
               "Feedback loop bias happens when biased decisions create new training data, amplifying the problem."],
      example: "A biased model might consistently rank qualified candidates from certain backgrounds lower, leading to fewer hires from these groups and reinforcing the pattern in future training data."
    }
  ];

  const DetailPanel = ({ biasType }: { biasType: typeof biasTypes[0] }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${biasType.color} flex items-center justify-center flex-shrink-0`}>
            {biasType.icon}
          </div>
          <div>
            <h3 className="text-lg font-medium">{biasType.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{biasType.description}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Visual Example</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 h-7 text-xs" 
                onClick={() => setShowBias(!showBias)}
              >
                {showBias ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Hide Bias</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Show Bias</span>
                  </>
                )}
              </Button>
            </div>
            {biasType.visual}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Real-World Example</h4>
          <div className="bg-muted/30 p-3 rounded-md text-sm">
            <p>{biasType.example}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Where It Appears in the Process</h4>
          <div className="grid grid-cols-4 gap-1">
            {stages.map(stage => (
              <div 
                key={stage.id} 
                className={cn(
                  "p-2 rounded-md text-center text-xs font-medium",
                  stage.biases.some(bias => bias.toLowerCase().includes(biasType.id)) 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted/30 text-muted-foreground"
                )}
              >
                Stage {stage.id}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const AIHiringPipeline = () => {
    return (
      <div className="mt-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">The AI Hiring Pipeline</h3>
          <p className="text-sm text-muted-foreground">
            Bias can enter at multiple stages of the AI-powered hiring process. Click each stage to learn more.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute h-0.5 bg-muted top-6 left-8 right-8 z-0"></div>
          <div className="relative z-10 flex justify-between">
            {stages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center w-1/4">
                <button
                  onClick={() => setActiveStage(stage.id === activeStage ? 0 : stage.id)}
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-sm font-medium transition-colors border-2",
                    activeStage === stage.id 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-muted border-muted-foreground/20"
                  )}
                >
                  {stage.id}
                </button>
                <div className="mt-2 text-xs font-medium text-center">{stage.title}</div>
              </div>
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {activeStage > 0 && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Stage {activeStage}: {stages[activeStage - 1].title}</CardTitle>
                  <CardDescription>{stages[activeStage - 1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Potential Bias Points:</h4>
                    <ul className="space-y-2">
                      {stages[activeStage - 1].biases.map((bias, index) => (
                        <motion.li 
                          key={index} 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{bias}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 text-sm">
                  <p>{stages[activeStage - 1].example}</p>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDetailContent = () => (
    <div className="pt-2">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Types of Algorithmic Bias</h3>
        <p className="text-sm text-muted-foreground">
          Explore the various ways bias enters AI hiring systems by selecting a type below.
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {biasTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveBiasType(type.id)}
            className={cn(
              "p-3 rounded-lg transition-all text-left flex items-center gap-2",
              activeBiasType === type.id
                ? `bg-gradient-to-br ${type.color} border border-primary/10`
                : "bg-muted/30 hover:bg-muted/50 border border-transparent"
            )}
          >
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0",
              activeBiasType === type.id ? "bg-background/80" : "bg-background/30"
            )}>
              {type.icon}
            </div>
            <span className="text-sm font-medium">{type.title}</span>
          </button>
        ))}
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <AnimatePresence mode="wait">
          <DetailPanel 
            key={activeBiasType} 
            biasType={biasTypes.find(t => t.id === activeBiasType)!} 
          />
        </AnimatePresence>
      </div>
      
      <AIHiringPipeline />
    </div>
  );

  // Mobile version uses Drawer
  const renderMobileView = () => (
    <div className="w-full max-w-3xl mx-auto opacity-0 animate-fade-in-up">
      <div className="grid grid-cols-1 md:hidden gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Understanding Bias in AI</h3>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Explore Bias Types</Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh] overflow-y-auto">
                <DrawerHeader>
                  <DrawerTitle>Types of Algorithmic Bias</DrawerTitle>
                  <DrawerDescription>
                    Explore the various ways bias enters AI hiring systems
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-8">
                  {renderDetailContent()}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          
          <div className="space-y-3">
            <p>
              Algorithmic bias in hiring occurs when AI systems systematically produce unfair outcomes for different demographic groups.
            </p>
            <p>
              These biases aren't typically introduced intentionally, but emerge from the data, design choices, and how systems are implemented.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {biasTypes.slice(0, 3).map((type, i) => (
              <Card key={type.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                      {type.icon}
                    </div>
                    <CardTitle className="text-base">{type.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{type.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                        Learn more <ChevronRight className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{type.title}</DialogTitle>
                        <DialogDescription>{type.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Example:</h4>
                          <p className="text-sm">{type.example}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Visual Representation:</h4>
                          <div className="relative">
                            {type.visual}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="absolute top-2 right-2 h-7 text-xs z-10"
                              onClick={() => setShowBias(!showBias)}
                            >
                              {showBias ? "Hide Bias" : "Show Bias"}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBias(false)}>
                          Reset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => {
              // Fix: Use querySelector to find the element, and directly use the drawer trigger ref
              const drawerTrigger = document.querySelector('[aria-controls="radix-:r12:"]');
              if (drawerTrigger && drawerTrigger instanceof HTMLElement) {
                drawerTrigger.click();
              }
            }}
          >
            View All Bias Types
          </Button>
        </div>
      </div>
      
      <div className="hidden md:block">
        {renderDesktopView()}
      </div>
    </div>
  );

  // Desktop version uses tabs
  const renderDesktopView = () => (
    <div className="w-full max-w-3xl mx-auto opacity-0 animate-fade-in-up">
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">How Bias Enters AI Hiring Systems</h3>
            <p className="text-muted-foreground">
              Algorithmic bias isn't usually introduced intentionally—it emerges through various mechanisms in the development and application of AI systems.
            </p>
          </div>
          
          <Tabs defaultValue="types" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="types">Bias Types</TabsTrigger>
              <TabsTrigger value="pipeline">AI Hiring Pipeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="types" className="pt-6">
              {renderDetailContent()}
            </TabsContent>
            
            <TabsContent value="pipeline" className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">The AI Hiring Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Modern AI-driven hiring systems involve multiple stages where bias can enter and be amplified.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stages.map((stage) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: stage.id * 0.1 }}
                      className="border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/30"
                    >
                      <div className="p-4 border-b bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="text-sm font-medium">{stage.id}</span>
                          </div>
                          <h3 className="font-medium">{stage.title}</h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-4">{stage.description}</p>
                        <h4 className="text-sm font-medium mb-2">Potential Biases:</h4>
                        <ul className="space-y-2">
                          {stage.biases.map((bias, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{bias}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/30 border-t">
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                            <span className="text-xs">Ex</span>
                          </div>
                          <p className="text-xs">{stage.example}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-4 border rounded-lg mt-8 bg-primary/5">
                  <h3 className="text-lg font-medium mb-3">The Amplification Effect</h3>
                  <p className="text-sm mb-3">
                    In AI hiring systems, bias isn't just present—it gets amplified through feedback loops:
                  </p>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <span className="text-xs">1</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Initial Bias:</span> Historical hiring data contains patterns of discrimination
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <span className="text-xs">2</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Learning:</span> AI systems learn to replicate these patterns, favoring certain demographics
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <span className="text-xs">3</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Reinforcement:</span> The system's biased selections become new "successful" data points
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <span className="text-xs">4</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Amplification:</span> With each cycle, the bias becomes more pronounced in the model
                      </div>
                    </li>
                  </ol>
                  <div className="mt-4 pt-3 border-t text-sm text-muted-foreground">
                    This feedback loop is why proactive bias detection and mitigation strategies are essential in AI hiring systems.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  return useMobileDrawer ? renderMobileView() : renderDesktopView();
};

export default BiasExplanation;
