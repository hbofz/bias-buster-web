
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  animated?: boolean;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  className, 
  children,
  animated = true 
}) => {
  return (
    <section 
      id={id} 
      className={cn(
        "py-16 md:py-24",
        className
      )}
    >
      <div className="container">
        <div className={cn(
          "max-w-3xl mb-10",
          animated && "opacity-0 animate-fade-in-up"
        )}>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
