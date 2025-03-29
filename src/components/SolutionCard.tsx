
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  className?: string;
  extendedDescription?: string;
  bulletPoints?: string[];
  implementationSteps?: {
    title: string;
    description: string;
  }[];
}

const SolutionCard: React.FC<SolutionCardProps> = ({ 
  icon, 
  title, 
  description, 
  index,
  className,
  extendedDescription,
  bulletPoints,
  implementationSteps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasExpandableContent = extendedDescription || bulletPoints?.length || implementationSteps?.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 hover:shadow-md",
        isExpanded && "shadow-md",
        className
      )}>
        <CardHeader className="pb-3">
          <motion.div 
            className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
          
          {hasExpandableContent && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-between mt-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>{isExpanded ? "Show less" : "Learn more"}</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          )}
          
          <AnimatePresence>
            {isExpanded && hasExpandableContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t mt-2 space-y-4">
                  {extendedDescription && (
                    <p className="text-sm">{extendedDescription}</p>
                  )}
                  
                  {bulletPoints && bulletPoints.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Points:</h4>
                      <ul className="text-sm space-y-1">
                        {bulletPoints.map((point, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start gap-2"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                              <span className="text-xs">{i + 1}</span>
                            </span>
                            <span>{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {implementationSteps && implementationSteps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Implementation Steps:</h4>
                      <div className="space-y-3">
                        {implementationSteps.map((step, i) => (
                          <motion.div 
                            key={i} 
                            className="pl-3 border-l-2 border-primary/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                          >
                            <h5 className="text-sm font-medium">{step.title}</h5>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SolutionCard;
