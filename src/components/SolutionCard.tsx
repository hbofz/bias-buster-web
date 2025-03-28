
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  className?: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ 
  icon, 
  title, 
  description, 
  index,
  className 
}) => {
  return (
    <Card className={cn(
      "opacity-0 animate-fade-in-up h-full",
      `delay-${index * 100}`,
      className
    )}>
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default SolutionCard;
