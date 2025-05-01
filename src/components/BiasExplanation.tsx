
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

  const BiasTypesSimplified = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2">6 Main Types of Algorithmic Bias</h3>
        <p className="text-muted-foreground">Select each type to learn more about how it affects AI hiring systems</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {biasTypes.map((bias) => (
          <Button
            key={bias.id}
            variant="outline"
            className={cn(
              "h-auto flex flex-col items-start p-5 gap-3 text-left bg-gradient-to-br border border-muted-foreground/10",
              bias.color,
              activeBiasType === bias.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
            )}
            onClick={() => setActiveBiasType(bias.id)}
          >
            <div className="h-8 w-8 rounded-full bg-background/80 flex items-center justify-center">
              {bias.icon}
            </div>
            <div>
              <h4 className="font-medium text-base mb-1">{bias.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{bias.description}</p>
            </div>
            {activeBiasType === bias.id && (
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        ))}
      </div>
      
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeBiasType && (
            <motion.div
              key={activeBiasType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-6 bg-card"
            >
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className={cn(
                    "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center",
                    biasTypes.find(b => b.id === activeBiasType)?.color
                  )}>
                    {biasTypes.find(b => b.id === activeBiasType)?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{biasTypes.find(b => b.id === activeBiasType)?.title}</h3>
                    <p className="text-muted-foreground mt-1">
                      {biasTypes.find(b => b.id === activeBiasType)?.description}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Visual Example</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBias(!showBias)}
                      className="flex items-center gap-1"
                    >
                      {showBias ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showBias ? "Hide Effect" : "Show Effect"}
                    </Button>
                  </div>
                  {biasTypes.find(b => b.id === activeBiasType)?.visual}
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Real-World Example:</h4>
                  <p className="text-sm">
                    {biasTypes.find(b => b.id === activeBiasType)?.example}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const BiasFlowchart = () => (
    <div className="space-y-8 mt-16">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2">How Bias Flows Through AI Hiring Systems</h3>
        <p className="text-muted-foreground">Follow the journey from data to decision to understand where bias enters the process</p>
      </div>
      
      <div className="relative">
        <div className="absolute h-1 bg-muted top-12 left-8 right-8 z-0"></div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex flex-col items-center">
              <button
                onClick={() => setActiveStage(stage.id === activeStage ? 0 : stage.id)}
                className={cn(
                  "h-24 w-24 rounded-full flex flex-col items-center justify-center text-center transition-colors",
                  activeStage === stage.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/70"
                )}
              >
                <span className="text-2xl font-bold mb-1">{stage.id}</span>
                <span className="text-xs px-2">{stage.title}</span>
              </button>
            </div>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {activeStage > 0 && (
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Stage {activeStage}: {stages[activeStage - 1].title}</CardTitle>
                  <CardDescription>{stages[activeStage - 1].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">How Bias Enters:</h4>
                    <ul className="space-y-3">
                      {stages[activeStage - 1].biases.map((bias, i) => (
                        <li key={i} className="flex gap-2">
                          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{bias}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h4 className="font-medium mb-1">Example:</h4>
                    <p>{stages[activeStage - 1].example}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
  
  const SimplifiedBiasExplanation = () => (
    <div className="space-y-12">
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">What is Algorithmic Bias?</h3>
        <p className="mb-4">
          Algorithmic bias in hiring occurs when AI systems produce results that unfairly favor certain groups over others. 
          This usually happens unintentionally, but can have real consequences for job seekers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium mb-2">Not A Bug, But A Feature</h4>
            <p className="text-sm text-muted-foreground">
              AI learns from historical data, so biases in that data become "features" the system learns to replicate.
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium mb-2">Invisible To Developers</h4>
            <p className="text-sm text-muted-foreground">
              Many biases are subtle and not obvious to the teams building AI systems.
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium mb-2">Multiplies Over Time</h4>
            <p className="text-sm text-muted-foreground">
              When biased AI makes hiring decisions, it creates new biased data, amplifying the problem.
            </p>
          </div>
        </div>
      </div>

      <BiasTypesSimplified />
      <BiasFlowchart />
    </div>
  );

  // Mobile version uses Drawer
  const renderMobileView = () => (
    <div className="w-full max-w-3xl mx-auto opacity-0 animate-fade-in-up">
      <SimplifiedBiasExplanation />
    </div>
  );

  // Desktop version uses tabs
  const renderDesktopView = () => (
    <div className="w-full max-w-3xl mx-auto opacity-0 animate-fade-in-up">
      <SimplifiedBiasExplanation />
    </div>
  );

  return useMobileDrawer ? renderMobileView() : renderDesktopView();
};

export default BiasExplanation;
