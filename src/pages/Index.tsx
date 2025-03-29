import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import CaseStudyCard from '@/components/CaseStudyCard';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import BiasExplanation from '@/components/BiasExplanation';
import LegalConsiderations from '@/components/LegalConsiderations';
import SolutionCard from '@/components/SolutionCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';
import { Shield, Database, LineChart, Brain, Users, Globe, Code, AlertTriangle, Compass } from 'lucide-react';

const Index = () => {
  const handleScroll = () => {
    const elements = document.querySelectorAll('.animate-fade-in-up');
    
    elements.forEach(element => {
      const position = element.getBoundingClientRect();
      
      if (position.top < window.innerHeight - 100) {
        element.classList.add('opacity-100');
      }
    });
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    // Clear localStorage on page load to reset the analyzer state
    localStorage.removeItem('resumeAnalyzerState');
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const solutionsData = [
    {
      icon: <Shield size={24} />,
      title: "Regular Bias Audits",
      description: "Conduct thorough assessments of AI systems before deployment and at regular intervals to detect potential bias issues early.",
      extendedDescription: "Bias audits involve systematic testing of AI systems with diverse datasets to identify patterns of discrimination or unfair outcomes.",
      bulletPoints: [
        "Use statistical methods to measure disparate impact across protected groups",
        "Test with both synthetic and real-world data",
        "Document findings and implemented mitigations for transparency"
      ],
      implementationSteps: [
        {
          title: "Pre-deployment Assessment",
          description: "Test system with diverse datasets before release"
        },
        {
          title: "Periodic Reviews",
          description: "Schedule regular audits at 3-6 month intervals"
        },
        {
          title: "Independent Verification",
          description: "Engage third-party auditors for unbiased evaluation"
        }
      ]
    },
    {
      icon: <Database size={24} />,
      title: "Diverse Training Data",
      description: "Ensure that data used to train AI hiring systems is diverse and representative of the broader population you want to hire.",
      extendedDescription: "The quality and diversity of training data directly impacts how AI systems learn to evaluate candidates. Biased data leads to biased outcomes.",
      bulletPoints: [
        "Analyze training data for demographic representation",
        "Augment underrepresented groups in training datasets",
        "Balance historical data with synthetic balanced datasets"
      ],
      implementationSteps: [
        {
          title: "Data Audit",
          description: "Analyze existing datasets for representation issues"
        },
        {
          title: "Augmentation",
          description: "Supplement with additional diverse samples"
        },
        {
          title: "Validation",
          description: "Verify balanced performance across demographics"
        }
      ]
    },
    {
      icon: <LineChart size={24} />,
      title: "Transparent Algorithms",
      description: "Use explainable AI methods that allow for understanding how decisions are made rather than black-box approaches.",
      extendedDescription: "Explainable AI (XAI) provides insights into decision-making processes, enabling stakeholders to understand and trust the system's outcomes.",
      bulletPoints: [
        "Implement feature importance analysis to show which factors influenced decisions",
        "Create plain-language explanations of AI decision processes",
        "Provide visual representations of decision paths"
      ],
      implementationSteps: [
        {
          title: "Model Selection",
          description: "Choose inherently interpretable models when possible"
        },
        {
          title: "Explanation Layer",
          description: "Add post-hoc explanation capabilities to complex models"
        },
        {
          title: "User Interface",
          description: "Design intuitive visualizations of decision factors"
        }
      ]
    },
    {
      icon: <Brain size={24} />,
      title: "Human Oversight",
      description: "Maintain meaningful human involvement in the hiring process. AI should support, not replace, human decision-making.",
      extendedDescription: "Human-in-the-loop approaches combine the efficiency of AI with human judgment, creating more fair and accountable hiring processes.",
      bulletPoints: [
        "Establish clear review protocols for AI recommendations",
        "Train humans to effectively oversee and question AI decisions",
        "Create override mechanisms for edge cases and unusual situations"
      ],
      implementationSteps: [
        {
          title: "Define Boundaries",
          description: "Clarify where AI assists vs. where humans decide"
        },
        {
          title: "Reviewer Training",
          description: "Educate human reviewers on bias recognition"
        },
        {
          title: "Feedback Loops",
          description: "Establish channels for human input to improve AI"
        }
      ]
    },
    {
      icon: <Users size={24} />,
      title: "Diverse Development Teams",
      description: "Ensure that teams developing AI hiring tools include people from diverse backgrounds who can identify potential bias issues.",
      extendedDescription: "Homogeneous teams often have blind spots when it comes to bias. Diverse perspectives lead to more inclusive product design.",
      bulletPoints: [
        "Include team members from different demographic backgrounds",
        "Incorporate perspectives from various disciplines (ethics, law, social sciences)",
        "Engage end users from diverse backgrounds in the development process"
      ],
      implementationSteps: [
        {
          title: "Team Composition",
          description: "Recruit diverse talent across roles and levels"
        },
        {
          title: "Inclusive Culture",
          description: "Create environment where all voices are heard"
        },
        {
          title: "External Partnerships",
          description: "Collaborate with diversity-focused organizations"
        }
      ]
    },
    {
      icon: <Code size={24} />,
      title: "Bias Mitigation Algorithms",
      description: "Implement specific technical approaches designed to reduce bias in AI models during development and deployment.",
      extendedDescription: "Several mathematical techniques can help reduce bias in machine learning pipelines, from pre-processing to post-processing stages.",
      bulletPoints: [
        "Pre-processing methods like reweighing and disparate impact removal",
        "In-processing constraints during model training",
        "Post-processing calibration to ensure fair outcomes across groups"
      ],
      implementationSteps: [
        {
          title: "Algorithm Selection",
          description: "Choose appropriate debiasing technique for your context"
        },
        {
          title: "Implementation",
          description: "Apply bias mitigation at multiple pipeline stages"
        },
        {
          title: "Evaluation",
          description: "Measure effectiveness through fairness metrics"
        }
      ]
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Ethical Red Teams",
      description: "Establish specialized teams tasked with actively trying to find ways the AI system could produce biased or harmful outcomes.",
      extendedDescription: "Red teams apply adversarial thinking to identify potential issues before they impact real users, improving system robustness.",
      bulletPoints: [
        "Conduct structured challenges to test system limitations",
        "Simulate edge cases and potential misuse scenarios",
        "Document and address vulnerabilities systematically"
      ],
      implementationSteps: [
        {
          title: "Team Formation",
          description: "Assemble diverse experts with critical thinking skills"
        },
        {
          title: "Testing Protocols",
          description: "Develop comprehensive scenarios to evaluate system"
        },
        {
          title: "Remediation Process",
          description: "Create clear paths to address identified issues"
        }
      ]
    },
    {
      icon: <Compass size={24} />,
      title: "Ethical Guidelines",
      description: "Develop and adhere to clear ethical principles specifically designed for AI in hiring contexts.",
      extendedDescription: "Ethical guidelines provide a framework for making consistent decisions about AI development and use in recruitment.",
      bulletPoints: [
        "Establish clear principles prioritizing fairness and non-discrimination",
        "Create practical decision-making frameworks for development teams",
        "Review and update guidelines as technology and society evolve"
      ],
      implementationSteps: [
        {
          title: "Principles Development",
          description: "Define core values with stakeholder input"
        },
        {
          title: "Documentation",
          description: "Create accessible reference materials for teams"
        },
        {
          title: "Integration",
          description: "Embed ethics checkpoints in development process"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden animate-gradient bg-gradient-to-r from-primary/5 via-background to-primary/10">
        <div className="container max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl opacity-0 animate-fade-in-up">
              Algorithmic Bias in Hiring
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-100">
              Unveiling how AI-powered hiring systems can perpetuate discrimination and exploring solutions for more equitable recruitment.
            </p>
            <div className="mt-10 opacity-0 animate-fade-in-up delay-200">
              <Button 
                size="lg" 
                className="rounded-full px-8"
                onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
      </section>
      
      <Section 
        id="overview" 
        title="Understanding Algorithmic Bias in Hiring"
        subtitle="AI-powered hiring systems are increasingly used to screen candidates, but they can perpetuate and amplify existing biases."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 opacity-0 animate-fade-in-up delay-100">
            <div>
              <h3 className="text-xl font-medium mb-2">What is Algorithmic Bias?</h3>
              <p className="text-muted-foreground">
                Algorithmic bias occurs when an automated system systematically and unfairly discriminates against certain individuals or groups in favor of others. In hiring, this can manifest as preferential treatment based on gender, race, age, or other protected characteristics.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">How AI Hiring Systems Work</h3>
              <p className="text-muted-foreground">
                AI hiring systems use machine learning algorithms trained on historical hiring data to screen resumes, evaluate video interviews, or assess candidate responses. These systems look for patterns that correlate with "successful" employees and make predictions about new candidates.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2">The Problem of Biased Data</h3>
              <p className="text-muted-foreground">
                If historical hiring data reflects past discriminatory practices, AI systems can learn and replicate these biases. For example, if a company historically hired more men than women for technical roles, the AI might learn to favor male candidates, even without explicitly considering gender.
              </p>
            </div>
          </div>
          
          <div className="relative p-1 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden opacity-0 animate-fade-in-up delay-200">
            <div className="aspect-video bg-white rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80"
                alt="AI hiring concept"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>
      
      <Section 
        id="case-studies" 
        title="Real-World Case Studies"
        subtitle="Several high-profile cases have demonstrated how algorithmic bias can manifest in hiring technologies."
        className="bg-muted/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CaseStudyCard
            title="Biased Recruiting Tool"
            company="Amazon"
            year="2018"
            description="Amazon developed an AI recruiting tool that showed bias against women. The system was trained on resumes submitted over a 10-year period, most of which came from men."
            impact="The algorithm penalized resumes containing terms like 'women's' and downgraded graduates of women's colleges. Amazon ultimately abandoned the tool."
            lessons={[
              "Training data reflecting historical biases will produce biased algorithms",
              "Even when gender is not explicitly considered, proxy variables can lead to discrimination",
              "Large tech companies are not immune to these challenges"
            ]}
            index={0}
          />
          
          <CaseStudyCard
            title="Facial Analysis Controversy"
            company="HireVue"
            year="2019-2021"
            description="HireVue's AI-powered video interview system analyzed candidates' facial expressions, word choices, and speaking voices to evaluate them against top-performing employees."
            impact="After criticism from AI ethicists and a FTC complaint, HireVue discontinued its facial analysis feature, though it continues to analyze language patterns."
            lessons={[
              "Facial analysis technology can perpetuate bias against minorities",
              "Public scrutiny can lead to positive changes in AI hiring practices",
              "There are significant concerns about transparency in AI hiring tools"
            ]}
            index={1}
          />
          
          <CaseStudyCard
            title="Disability Discrimination"
            company="Multiple Companies"
            year="2022"
            description="Various resume screening tools were found to automatically reject candidates with employment gaps, even when these gaps were due to disability-related medical leave."
            impact="This led to the EEOC issuing guidance on how the use of AI in hiring could violate the Americans with Disabilities Act."
            lessons={[
              "AI systems can discriminate against people with disabilities",
              "Seemingly neutral criteria like employment gaps can serve as proxy variables",
              "Regulatory agencies are increasingly aware of algorithmic bias issues"
            ]}
            index={2}
          />
        </div>
      </Section>
      
      <Section 
        id="simulation" 
        title="Interactive Bias Simulation"
        subtitle="Experience how AI hiring systems might evaluate your resume based on actual content and identify potential bias triggers."
      >
        <ResumeAnalyzer />
      </Section>
      
      <Section 
        id="mechanisms" 
        title="How Bias Enters AI Systems"
        subtitle="Understanding the technical mechanisms behind algorithmic bias is key to developing solutions."
        className="bg-muted/30"
      >
        <BiasExplanation />
      </Section>
      
      <Section 
        id="legal" 
        title="Legal and Ethical Considerations"
        subtitle="Various laws and ethical frameworks apply to AI hiring systems across different regions."
      >
        <LegalConsiderations />
      </Section>
      
      <Section 
        id="solutions" 
        title="Solutions and Best Practices"
        subtitle="While algorithmic bias presents significant challenges, there are promising approaches to mitigate it."
        className="bg-muted/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutionsData.slice(0, 8).map((solution, index) => (
            <SolutionCard
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
              index={index}
              extendedDescription={solution.extendedDescription}
              bulletPoints={solution.bulletPoints}
              implementationSteps={solution.implementationSteps}
            />
          ))}
        </div>
      </Section>
      
      <Section 
        id="conclusion" 
        title="Conclusion and Call to Action"
        subtitle="Creating fair AI hiring systems requires ongoing commitment from multiple stakeholders."
      >
        <div className="max-w-3xl mx-auto opacity-0 animate-fade-in-up">
          <div className="prose prose-lg">
            <p>
              Algorithmic bias in hiring systems is not just a technical problem but a social and ethical one with real consequences for individuals and society. As AI becomes more prevalent in recruitment, we must be vigilant about ensuring these systems promote fairness rather than perpetuate discrimination.
            </p>
            
            <p>
              Key takeaways from this educational resource:
            </p>
            
            <ul>
              <li>AI hiring systems can perpetuate and amplify historical biases present in training data</li>
              <li>Even when protected characteristics are removed, algorithms can find proxy variables that correlate with them</li>
              <li>Legal frameworks are evolving to address algorithmic discrimination, but often lag behind technological developments</li>
              <li>Solutions require technical approaches, policy changes, and organizational commitment to fairness</li>
            </ul>
            
            <p>
              As students, educators, and citizens, we can advocate for responsible AI development and use in hiring by:
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 mb-10">
            <div className="border rounded-lg p-6 bg-muted/30">
              <h3 className="font-medium text-lg mb-4">For Individuals</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Stay informed about how your data is used in hiring processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Ask questions about AI use when applying for jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Support organizations advocating for algorithmic fairness</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-6 bg-muted/30">
              <h3 className="font-medium text-lg mb-4">For Organizations</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Audit existing hiring algorithms for potential bias</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Establish diverse AI development teams</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Implement transparent AI practices with human oversight</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-medium mb-6">Further Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="https://www.eeoc.gov/laws/guidance/americans-disabilities-act-and-use-software-algorithms-and-artificial-intelligence" target="_blank" rel="noopener noreferrer" className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium">EEOC Guidance on AI</h4>
                <p className="text-sm text-muted-foreground mt-1">Official guidance on AI and the ADA</p>
              </a>
              
              <a href="https://ainowinstitute.org/" target="_blank" rel="noopener noreferrer" className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium">AI Now Institute</h4>
                <p className="text-sm text-muted-foreground mt-1">Research on social implications of AI</p>
              </a>
              
              <a href="https://www.algofairness.org/" target="_blank" rel="noopener noreferrer" className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                <h4 className="font-medium">Algorithmic Justice League</h4>
                <p className="text-sm text-muted-foreground mt-1">Combating algorithmic bias</p>
              </a>
            </div>
          </div>
        </div>
      </Section>
      
      <Footer />
    </div>
  );
};

export default Index;
