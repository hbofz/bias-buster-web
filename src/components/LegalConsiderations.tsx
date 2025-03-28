
import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Scale, FileText, Globe } from 'lucide-react';

const LegalConsiderations: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto opacity-0 animate-fade-in-up">
      <Tabs defaultValue="us">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="us">United States</TabsTrigger>
          <TabsTrigger value="eu">European Union</TabsTrigger>
          <TabsTrigger value="others">Other Regions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="us" className="space-y-6 mt-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">Title VII of the Civil Rights Act</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Prohibits employment discrimination based on race, color, religion, sex, and national origin. 
                AI hiring tools that create disparate impact can violate this law.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">New York City's AI Bias Audit Law</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Local Law 144 requires employers to conduct independent bias audits of automated employment decision tools 
                before using them, effective from January 2023.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">EEOC Guidance on AI</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The Equal Employment Opportunity Commission has issued guidance on how employers' use of AI 
                tools may violate the Americans with Disabilities Act.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="eu" className="space-y-6 mt-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">General Data Protection Regulation (GDPR)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                GDPR gives individuals the right to explanation for automated decisions and 
                the right to object to automated processing, including profiling.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">EU AI Act</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This proposed legislation would classify AI systems used in employment as "high risk" 
                and impose strict requirements for transparency, human oversight, and risk assessment.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="others" className="space-y-6 mt-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">Canada's PIPEDA</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The Personal Information Protection and Electronic Documents Act governs how private 
                organizations collect, use, and disclose personal information, impacting AI hiring systems.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium">Brazil's LGPD</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Brazil's General Data Protection Law includes provisions against automated decision-making 
                that affects individuals' interests, including hiring decisions.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 border rounded-md bg-muted/30">
        <h3 className="font-medium mb-2">Ethical Considerations Beyond Legal Requirements:</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <span className="text-xs">1</span>
            </div>
            <span><strong>Transparency:</strong> Job candidates should know when AI is being used to evaluate them and how it works.</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <span className="text-xs">2</span>
            </div>
            <span><strong>Human Oversight:</strong> AI should support rather than replace human decision-making in hiring.</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <span className="text-xs">3</span>
            </div>
            <span><strong>Regular Auditing:</strong> Continuous monitoring and testing for bias should be standard practice.</span>
          </li>
          <li className="flex items-start gap-2 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <span className="text-xs">4</span>
            </div>
            <span><strong>Inclusion by Design:</strong> AI systems should be designed from the ground up with diversity in mind.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LegalConsiderations;
