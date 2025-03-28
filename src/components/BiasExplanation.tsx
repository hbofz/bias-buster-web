
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    title: "Data Collection",
    description: "AI algorithms learn from historical data, which often contains human biases. If a company historically hired more men than women for technical roles, the algorithm learns this pattern.",
    visualization: (
      <div className="grid grid-cols-5 gap-4 my-6">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={cn(
            "aspect-square rounded-md flex items-center justify-center text-lg font-bold",
            i < 4 ? "bg-blue-100 text-blue-500" : "bg-pink-100 text-pink-500"
          )}>
            {i < 4 ? "M" : "F"}
          </div>
        ))}
        <div className="col-span-5 text-center text-xs text-muted-foreground mt-2">
          Historical data with 80% male (M) and 20% female (F) candidates
        </div>
      </div>
    )
  },
  {
    title: "Pattern Recognition",
    description: "The AI identifies patterns in successful candidates. If most were men from specific universities or with particular keywords (like 'executed' or 'dominated'), it associates these with success.",
    visualization: (
      <div className="my-6">
        <div className="border rounded-md p-4 bg-muted/30 mb-4">
          <div className="font-medium mb-2">Common Patterns in "Successful" Resumes:</div>
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Contains action verbs like "executed," "captured," "dominated"</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Degrees from specific universities</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Specific technical certifications</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Experience at certain companies</span>
            </li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          The algorithm learns to associate these patterns with "good candidates"
        </div>
      </div>
    )
  },
  {
    title: "Proxy Variables",
    description: "Even when explicitly removing gender or race, AI can still identify proxy variables (like hobbies, school names, or address) that correlate with protected characteristics.",
    visualization: (
      <div className="my-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-destructive/10">
            <div className="font-medium mb-1 text-sm">Explicitly Removed</div>
            <ul className="text-xs space-y-1">
              <li className="line-through">Gender</li>
              <li className="line-through">Race</li>
              <li className="line-through">Age</li>
              <li className="line-through">Photos</li>
            </ul>
          </div>
          <div className="border rounded-md p-3 bg-amber-500/10">
            <div className="font-medium mb-1 text-sm">Proxy Variables</div>
            <ul className="text-xs space-y-1">
              <li>Women's college names</li>
              <li>Address (neighborhood demographics)</li>
              <li>Graduation year (indicates age)</li>
              <li>Gender-associated hobbies</li>
            </ul>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-4">
          The algorithm can still infer protected characteristics through correlations
        </div>
      </div>
    )
  },
  {
    title: "Feedback Loop",
    description: "As the AI makes decisions, it creates a feedback loop. If it selects mostly male candidates, they get hired and become new 'successful' data points, reinforcing the pattern.",
    visualization: (
      <div className="my-6">
        <div className="flex flex-col items-center">
          <div className="w-40 h-12 bg-primary/10 rounded-md flex items-center justify-center mb-3">
            Initial biased data
          </div>
          <ChevronRight className="rotate-90 text-muted-foreground" />
          <div className="w-48 h-12 bg-primary/20 rounded-md flex items-center justify-center my-3">
            AI makes biased predictions
          </div>
          <ChevronRight className="rotate-90 text-muted-foreground" />
          <div className="w-56 h-12 bg-primary/30 rounded-md flex items-center justify-center my-3">
            Biased candidates get hired
          </div>
          <ChevronRight className="rotate-90 text-muted-foreground" />
          <div className="w-64 h-12 bg-primary/40 rounded-md flex items-center justify-center mt-3">
            New data reinforces bias
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-4">
          The cycle creates amplifying feedback loops that strengthen the bias over time
        </div>
      </div>
    )
  },
];

const BiasExplanation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };
  
  const handlePrevious = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto shadow-card border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <div className="flex bg-muted/30">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleStepClick(index)}
            className={cn(
              "flex-1 px-3 py-4 text-center text-sm font-medium border-b-2 transition-all",
              currentStep === index
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="hidden md:inline">{step.title}</span>
            <span className="md:hidden">{index + 1}</span>
          </button>
        ))}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
        <p className="mt-2 text-muted-foreground">{steps[currentStep].description}</p>
        
        {steps[currentStep].visualization}
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="hover:shadow-soft"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="hover:shadow-glow"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BiasExplanation;
