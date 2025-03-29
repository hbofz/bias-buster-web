import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Scale, FileText, Globe, ExternalLink, Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface Regulation {
  id: string;
  title: string;
  description: string;
  implementationYear: string;
  complianceLevel: number;
  icon: React.ElementType;
  link?: string;
  linkText?: string;
}

const regulations: Record<string, Regulation[]> = {
  us: [
    {
      id: "title-vii",
      title: "Title VII of the Civil Rights Act",
      description: "Prohibits employment discrimination based on race, color, religion, sex, and national origin. AI hiring tools that create disparate impact can violate this law.",
      implementationYear: "1964",
      complianceLevel: 85,
      icon: Scale,
      link: "https://www.eeoc.gov/statutes/title-vii-civil-rights-act-1964",
      linkText: "EEOC Guidelines"
    },
    {
      id: "nyc-law",
      title: "New York City's AI Bias Audit Law",
      description: "Local Law 144 requires employers to conduct independent bias audits of automated employment decision tools before using them.",
      implementationYear: "January 2023",
      complianceLevel: 65,
      icon: FileText,
      link: "https://www.nyc.gov/assets/dcwp/downloads/pdf/businesses/final-rule-automated-employment-decision-tools.pdf",
      linkText: "Full Regulation"
    },
    {
      id: "eeoc",
      title: "EEOC Guidance on AI",
      description: "The Equal Employment Opportunity Commission has issued guidance on how employers' use of AI tools may violate the Americans with Disabilities Act.",
      implementationYear: "May 2022",
      complianceLevel: 70,
      icon: AlertCircle,
      link: "https://www.eeoc.gov/laws/guidance/americans-disabilities-act-and-use-software-algorithms-and-artificial-intelligence",
      linkText: "EEOC Guidance"
    },
    {
      id: "illinois-bipa",
      title: "Illinois Biometric Information Privacy Act",
      description: "Regulates the collection and use of biometric data, which can impact AI tools that use facial recognition in interviews.",
      implementationYear: "2008",
      complianceLevel: 80,
      icon: ShieldCheck,
      link: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3004&ChapterID=57",
      linkText: "BIPA Text"
    }
  ],
  eu: [
    {
      id: "gdpr",
      title: "General Data Protection Regulation (GDPR)",
      description: "GDPR gives individuals the right to explanation for automated decisions and the right to object to automated processing, including profiling.",
      implementationYear: "May 2018",
      complianceLevel: 90,
      icon: Globe,
      link: "https://gdpr-info.eu/",
      linkText: "GDPR Info"
    },
    {
      id: "eu-ai-act",
      title: "EU AI Act",
      description: "This proposed legislation would classify AI systems used in employment as 'high risk' and impose strict requirements for transparency, human oversight, and risk assessment.",
      implementationYear: "Proposed, expected 2024",
      complianceLevel: 50,
      icon: FileText,
      link: "https://artificialintelligenceact.eu/",
      linkText: "AI Act Tracker"
    },
    {
      id: "ai-liability",
      title: "AI Liability Directive",
      description: "Addresses damages caused by AI systems and facilitates claims for compensation from companies deploying harmful AI.",
      implementationYear: "Proposed, expected 2024",
      complianceLevel: 45,
      icon: Scale,
      link: "https://digital-strategy.ec.europa.eu/en/library/ai-liability-directive",
      linkText: "Directive Proposal"
    },
    {
      id: "transparency-act",
      title: "Algorithmic Transparency Requirements",
      description: "Several EU countries have implemented or proposed transparency requirements for algorithmic decision-making in public and private sectors.",
      implementationYear: "Various (2018-2023)",
      complianceLevel: 75,
      icon: AlertCircle
    }
  ],
  others: [
    {
      id: "pipeda",
      title: "Canada's PIPEDA",
      description: "The Personal Information Protection and Electronic Documents Act governs how private organizations collect, use, and disclose personal information, impacting AI hiring systems.",
      implementationYear: "2000, updated 2020",
      complianceLevel: 80,
      icon: Globe,
      link: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
      linkText: "PIPEDA Overview"
    },
    {
      id: "lgpd",
      title: "Brazil's LGPD",
      description: "Brazil's General Data Protection Law includes provisions against automated decision-making that affects individuals' interests, including hiring decisions.",
      implementationYear: "August 2020",
      complianceLevel: 75,
      icon: FileText,
      link: "https://iapp.org/resources/article/brazilian-data-protection-law-lgpd-english-translation/",
      linkText: "LGPD Translation"
    },
    {
      id: "appi",
      title: "Japan's APPI",
      description: "The Act on the Protection of Personal Information regulates the use of personal data in automated decisions, including AI-based recruitment.",
      implementationYear: "2003, updated 2022",
      complianceLevel: 85,
      icon: ShieldCheck,
      link: "https://www.ppc.go.jp/en/legal/",
      linkText: "PPC Guidelines"
    },
    {
      id: "ai-governance",
      title: "Australia's AI Ethics Framework",
      description: "Voluntary principles for ensuring AI systems are safe, secure and reliable, with specific guidance for recruitment systems.",
      implementationYear: "2019",
      complianceLevel: 60,
      icon: AlertCircle,
      link: "https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-framework",
      linkText: "AI Ethics Framework"
    }
  ]
};

const ethicalGuidelines = [
  {
    title: "Transparency",
    description: "Job candidates should know when AI is being used to evaluate them and how it works.",
    icon: "1",
    details: "Organizations should disclose the use of AI in hiring processes, including what data is collected, how it's used, and the potential impact on hiring decisions."
  },
  {
    title: "Human Oversight",
    description: "AI should support rather than replace human decision-making in hiring.",
    icon: "2",
    details: "AI should be used as a tool to assist human recruiters, not as an autonomous decision-maker. Critical decisions should always involve human judgment."
  },
  {
    title: "Regular Auditing",
    description: "Continuous monitoring and testing for bias should be standard practice.",
    icon: "3",
    details: "Organizations should implement regular audits of AI hiring tools for biases, documenting the results and adjusting systems when necessary."
  },
  {
    title: "Inclusion by Design",
    description: "AI systems should be designed from the ground up with diversity in mind.",
    icon: "4",
    details: "Inclusion should be a core principle in the design and development process, not an afterthought. This means diverse training data and development teams."
  },
  {
    title: "Candidate Appeals Process",
    description: "Candidates should have the ability to challenge automated decisions.",
    icon: "5",
    details: "Organizations should establish clear processes for candidates to request information about and appeal decisions made by automated systems."
  },
  {
    title: "Accessibility Considerations",
    description: "AI hiring tools should be accessible to candidates with disabilities.",
    icon: "6",
    details: "Systems should be designed to accommodate various disabilities and not create additional barriers for candidates with different abilities."
  }
];

const RegulationCard = ({ regulation }: { regulation: Regulation }) => {
  const Icon = regulation.icon;
  
  return (
    <motion.div 
      className="border rounded-lg p-5 space-y-3 bg-background hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium">{regulation.title}</h3>
            <p className="text-sm text-muted-foreground">{regulation.implementationYear}</p>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Learn more">
              <HelpCircle size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{regulation.title}</DialogTitle>
              <DialogDescription>
                <div className="py-4">{regulation.description}</div>
                {regulation.link && (
                  <a 
                    href={regulation.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-primary hover:underline mt-2"
                  >
                    <ExternalLink size={14} /> {regulation.linkText || "Learn more"}
                  </a>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Current Compliance Difficulty</span>
                  <span className="text-sm font-medium">{regulation.complianceLevel}%</span>
                </div>
                <Progress value={regulation.complianceLevel} className="h-2" />
              </div>
              
              <div className="p-3 bg-muted/50 rounded-md text-sm">
                <p className="font-medium mb-1">Implementation Considerations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Documentation requirements</li>
                  <li>Technical compliance measures</li>
                  <li>Potential penalties for non-compliance</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <p className="text-sm text-muted-foreground">{regulation.description}</p>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs">Implementation Complexity</span>
          <span className="text-xs">{regulation.complianceLevel}%</span>
        </div>
        <Progress value={regulation.complianceLevel} className="h-1.5" />
      </div>
    </motion.div>
  );
};

const LegalConsiderations: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<string>("us");
  const [expandedGuidelineIndex, setExpandedGuidelineIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto opacity-0 animate-fade-in-up">
      <div className="mb-8">
        <motion.h2 
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Navigating the Legal Landscape
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          As AI hiring tools become more prevalent, various jurisdictions have enacted or proposed regulations to address potential bias and discrimination.
        </motion.p>
      </div>
      
      <Tabs defaultValue="us" value={activeRegion} onValueChange={setActiveRegion}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="us">United States</TabsTrigger>
          <TabsTrigger value="eu">European Union</TabsTrigger>
          <TabsTrigger value="others">Other Regions</TabsTrigger>
        </TabsList>
        
        {["us", "eu", "others"].map((region) => (
          <TabsContent key={region} value={region} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regulations[region].map((regulation, index) => (
                <RegulationCard key={regulation.id} regulation={regulation} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <Separator className="my-8" />
      
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4">Ethical Considerations Beyond Legality</h2>
        <p className="text-muted-foreground mb-6">
          Even when legally compliant, AI hiring systems raise important ethical questions that organizations must address:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ethicalGuidelines.map((guideline, index) => (
            <motion.div 
              key={index}
              className={cn(
                "border rounded-lg p-5 bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer",
                expandedGuidelineIndex === index && "bg-muted/30"
              )}
              onClick={() => setExpandedGuidelineIndex(expandedGuidelineIndex === index ? null : index)}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="text-xs font-medium">{guideline.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{guideline.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
                  
                  {expandedGuidelineIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t text-sm"
                    >
                      {guideline.details}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-8 p-6 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Recommended Approach
        </h3>
        <p className="text-muted-foreground mb-4">
          Organizations should adopt a holistic approach that goes beyond mere legal compliance:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Implement both technical and procedural safeguards against algorithmic bias</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Maintain documentation of AI system design decisions and bias mitigation efforts</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Engage diverse stakeholders in the development and evaluation of AI hiring tools</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <span>Establish clear lines of accountability for AI-related decisions</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default LegalConsiderations;
