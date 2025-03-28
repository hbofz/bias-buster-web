
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CaseStudyCardProps {
  title: string;
  company: string;
  year: string;
  description: string;
  impact: string;
  lessons: string[];
  className?: string;
  index: number;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ 
  title, 
  company, 
  year, 
  description, 
  impact, 
  lessons,
  className,
  index
}) => {
  return (
    <Card className={cn(
      "opacity-0 animate-fade-in-up h-full flex flex-col",
      `delay-${index * 100}`,
      className
    )}>
      <CardHeader>
        <div className="text-sm text-muted-foreground">{company} • {year}</div>
        <CardTitle className="mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-4">{description}</p>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Impact:</h4>
          <p className="text-muted-foreground">{impact}</p>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Key Lessons:</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {lessons.map((lesson, i) => (
              <li key={i} className="mb-1">{lesson}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
