
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, Brain, Database, Code, Users, Webhook, LineChart, Network, Lock, Zap, RefreshCw, Filter, AlertCircle } from 'lucide-react';

const steps = [
  {
    title: "Biased Training Data",
    description: "AI algorithms learn from historical data that often contains implicit human biases. When an algorithm is trained on resumes from a company that historically hired more men than women for technical roles, it learns to favor male candidates—even without explicitly considering gender.",
    visualization: (
      <div className="my-6">
        <div className="relative bg-muted/30 p-5 rounded-xl overflow-hidden border">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex justify-between mb-3 items-center">
              <h4 className="font-medium text-sm">Historical Hiring Data</h4>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-8 gap-2 mb-6">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-md flex items-center justify-center text-xs font-medium",
                  i < 32 ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                )}>
                  {i < 32 ? "M" : "F"}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-3 w-3 rounded-sm bg-blue-100"></div>
              <span>Male candidates (80%)</span>
              <div className="h-3 w-3 rounded-sm bg-pink-100 ml-3"></div>
              <span>Female candidates (20%)</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 border rounded-md bg-destructive/5">
            <h5 className="font-medium mb-2 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Bias Entry Point</span>
            </h5>
            <p className="text-xs text-muted-foreground">When this data is used to train AI, it will perceive the 80/20 split as the "correct" pattern and apply it to future candidates.</p>
          </div>
          <div className="p-4 border rounded-md">
            <h5 className="font-medium mb-2 text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span>Algorithm Effect</span>
            </h5>
            <p className="text-xs text-muted-foreground">The AI starts to associate certain resume elements with "successful" candidates and reinforces existing patterns.</p>
          </div>
        </div>
      </div>
    ),
    insights: [
      "Training data reflects past human decisions and cultural biases",
      "AI systems often learn from datasets that are not demographically balanced",
      "The past becomes the predictor for the future, perpetuating existing inequities"
    ]
  },
  {
    title: "Pattern Recognition Bias",
    description: "AI systems excel at identifying patterns in data—but they can't distinguish between valid job-relevant patterns and discriminatory correlations. These systems identify qualities and keywords that appear frequently in the training data and use them to score new candidates, unknowingly perpetuating historical bias.",
    visualization: (
      <div className="my-6">
        <div className="bg-gradient-to-r from-primary/5 to-background p-5 rounded-xl border">
          <div className="flex justify-between mb-3 items-center">
            <h4 className="font-medium text-sm">AI Pattern Recognition</h4>
            <Network className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h5 className="text-sm font-medium mb-3 flex items-center">
                <Webhook className="mr-2 h-4 w-4 text-blue-500" />
                Masculine-Associated Patterns
              </h5>
              <ul className="space-y-2">
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] mt-0.5">+</div>
                  <span>Action verbs: "executed," "drove," "captured," "dominated"</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] mt-0.5">+</div>
                  <span>Competitive sports or achievements</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] mt-0.5">+</div>
                  <span>Leadership framed as "directing" or "leading"</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] mt-0.5">+</div>
                  <span>Technical skills prominently featured</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h5 className="text-sm font-medium mb-3 flex items-center">
                <Webhook className="mr-2 h-4 w-4 text-pink-500" />
                Feminine-Associated Patterns
              </h5>
              <ul className="space-y-2">
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] mt-0.5">-</div>
                  <span>Collaborative verbs: "assisted," "contributed," "supported"</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] mt-0.5">-</div>
                  <span>Social or community activities</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] mt-0.5">-</div>
                  <span>Leadership framed as "coordinating" or "facilitating"</span>
                </li>
                <li className="text-xs flex items-start gap-2">
                  <div className="min-w-4 h-4 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] mt-0.5">-</div>
                  <span>Soft skills emphasized over technical skills</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-4 bg-muted/30 p-3 rounded-md">
            <div className="flex items-center mb-1">
              <Code className="h-3 w-3 mr-1" />
              <span className="font-mono text-[10px]">AI scoring_weight = frequency_in_successful_candidates / total_occurrences</span>
            </div>
            <p>The algorithm assigns higher weights to patterns more common in historically successful candidates, treating correlation as causation.</p>
          </div>
        </div>
      </div>
    ),
    insights: [
      "AI systems can't distinguish between correlation and causation",
      "What we perceive as 'neutral' features often have hidden demographic correlations",
      "Language choice and self-presentation styles vary across demographic groups"
    ]
  },
  {
    title: "Proxy Variable Detection",
    description: "Even when algorithms explicitly exclude protected characteristics like gender, race, or age, they can discover 'proxy variables' that correlate with these attributes. For example, an algorithm might identify that graduates of women's colleges are less likely to be 'successful' based on historical data, effectively discriminating by gender without explicitly considering it.",
    visualization: (
      <div className="my-6">
        <div className="bg-gradient-to-r from-muted/20 to-background p-5 rounded-xl border">
          <div className="flex justify-between mb-4 items-center">
            <h4 className="font-medium text-sm">AI Finding Proxy Variables</h4>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-destructive/5 p-3 rounded-md border border-destructive/20">
              <h5 className="text-xs font-medium mb-2">Explicitly Removed Variables</h5>
              <ul className="space-y-1.5">
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-[8px] text-red-600">✕</span>
                  </div>
                  <span className="line-through text-muted-foreground">Gender (Male/Female)</span>
                </li>
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-[8px] text-red-600">✕</span>
                  </div>
                  <span className="line-through text-muted-foreground">Age (Birth Date)</span>
                </li>
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-[8px] text-red-600">✕</span>
                  </div>
                  <span className="line-through text-muted-foreground">Race/Ethnicity</span>
                </li>
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-[8px] text-red-600">✕</span>
                  </div>
                  <span className="line-through text-muted-foreground">Disability Status</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <h5 className="text-xs font-medium mb-2">Discovered Proxy Variables</h5>
              <ul className="space-y-1.5">
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-[10px] text-amber-600">!</span>
                  </div>
                  <span>Women's college names (Mills College)</span>
                </li>
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-[10px] text-amber-600">!</span>
                  </div>
                  <span>Graduation year (indicates age)</span>
                </li>
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-[10px] text-amber-600">!</span>
                  </div>
                  <span>Address/ZIP code (demographic correlations)</span>
                </li>
                <li className="text-xs flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-[10px] text-amber-600">!</span>
                  </div>
                  <span>Employment gaps (may indicate caregiving)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-muted/20 rounded-md">
            <h5 className="text-xs font-medium mb-2 flex items-center">
              <Zap className="h-3 w-3 mr-1.5 text-primary" />
              <span>The Algorithmic Connection</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 bg-white rounded border text-[10px]">
                <strong>Example:</strong> Address in ZIP code 94110 correlates with 35% Hispanic population
              </div>
              <div className="p-2 bg-white rounded border text-[10px]">
                <strong>Example:</strong> Mills College graduate correlates with 100% female identity
              </div>
              <div className="p-2 bg-white rounded border text-[10px]">
                <strong>Example:</strong> 2-year gap in work history correlates with 78% likelihood of parenthood
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Real-World Example</span>
            </h5>
            <p className="text-xs">Amazon's experimental AI recruiting tool downgraded resumes containing the word "women's" and resumes from all-women's colleges, despite gender not being an explicit variable in the system.</p>
          </div>
          <div className="p-4 border rounded-md bg-destructive/5">
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Why This Matters</span>
            </h5>
            <p className="text-xs">The AI identifies patterns that indirectly reveal protected characteristics, creating a technical loophole around anti-discrimination laws and policies.</p>
          </div>
        </div>
      </div>
    ),
    insights: [
      "AI can infer protected characteristics from seemingly neutral information",
      "Simply removing protected variables does not prevent discrimination",
      "Proxy discrimination is often more difficult to detect and challenge legally",
      "Algorithmic systems can circumvent human oversight mechanisms"
    ]
  },
  {
    title: "Feedback Loop Amplification",
    description: "AI systems create powerful feedback loops that amplify biases over time. When an AI selects candidates based on biased patterns, those candidates get hired and become new data points that reinforforce the original bias—creating an escalating cycle of discrimination that becomes increasingly difficult to detect or correct.",
    visualization: (
      <div className="my-6">
        <div className="bg-gradient-to-br from-primary/5 via-background to-muted/20 p-5 rounded-xl border">
          <div className="flex justify-between mb-4 items-center">
            <h4 className="font-medium text-sm">The Bias Amplification Cycle</h4>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="relative">
            <div className="max-w-md mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-64 p-3 bg-white border rounded-lg shadow-sm mb-2 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h6 className="text-xs font-medium">1. Historically Biased Training Data</h6>
                      <p className="text-[10px] text-muted-foreground mt-1">80% male representation in past "successful" hires</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-6 w-0.5 bg-gradient-to-b from-primary/40 to-primary/20"></div>
                
                <div className="w-64 p-3 bg-white border rounded-lg shadow-sm mb-2 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h6 className="text-xs font-medium">2. AI Makes Biased Predictions</h6>
                      <p className="text-[10px] text-muted-foreground mt-1">Algorithm favors candidates with patterns found in previous male hires</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-6 w-0.5 bg-gradient-to-b from-primary/40 to-primary/20"></div>
                
                <div className="w-64 p-3 bg-white border rounded-lg shadow-sm mb-2 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h6 className="text-xs font-medium">3. Biased Candidates Get Hired</h6>
                      <p className="text-[10px] text-muted-foreground mt-1">New hires continue to reflect the unbalanced 80/20 gender ratio</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-6 w-0.5 bg-gradient-to-b from-primary/40 to-primary/20"></div>
                
                <div className="w-64 p-3 bg-white border rounded-lg shadow-sm relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                      <LineChart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h6 className="text-xs font-medium">4. Bias Reinforcement</h6>
                      <p className="text-[10px] text-muted-foreground mt-1">New hires' data is added to the training dataset, further reinforcing the pattern</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-10 w-0.5 bg-gradient-to-b from-primary/40 to-primary/5"></div>
                
                <div className="w-72 p-3 bg-primary/10 border border-primary/20 rounded-lg shadow-sm relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded-full p-2 flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <h6 className="text-xs font-medium">Result: Exponential Bias Amplification</h6>
                      <p className="text-[10px] text-muted-foreground mt-1">Each iteration of the cycle makes the system increasingly biased over time, potentially reaching an 85/15 or 90/10 ratio</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Curved line connecting the first and last box */}
              <div className="absolute right-0 top-0 bottom-0 w-16 border-r-2 border-dashed border-primary/20 rounded-r-full h-full"></div>
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 -translate-x-4">
                <ChevronRight className="h-8 w-8 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 border rounded-md bg-muted/10">
          <h5 className="font-medium text-sm mb-3">Real-World Consequences of Feedback Loops</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h6 className="text-xs font-medium mb-2">Increasing Inequality</h6>
              <p className="text-[10px] text-muted-foreground">Initial small biases become significantly larger over multiple iterations, creating substantial representation gaps.</p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h6 className="text-xs font-medium mb-2">Data Ossification</h6>
              <p className="text-[10px] text-muted-foreground">The AI becomes increasingly confident in its biased patterns, making the system more resistant to change over time.</p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h6 className="text-xs font-medium mb-2">Harder Detection</h6>
              <p className="text-[10px] text-muted-foreground">As bias becomes encoded in layers of algorithmic decisions, it becomes increasingly difficult to identify and correct.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    insights: [
      "Small initial biases can grow exponentially through feedback loops",
      "AI systems tend to increase confidence in their decisions over time",
      "Without intervention, algorithmic bias becomes self-reinforcing",
      "The feedback loop creates 'runaway bias' that quickly exceeds the original bias level"
    ]
  },
  {
    title: "Complex Interaction Effects",
    description: "Bias doesn't exist in isolation—it often compounds through intersectional effects. For example, a hiring algorithm might show minimal bias when analyzing gender alone or socioeconomic factors alone, but create dramatic discrimination against women from low-income backgrounds when these factors interact. These complex interactions make bias harder to detect and mitigate.",
    visualization: (
      <div className="my-6">
        <div className="bg-gradient-to-r from-background to-muted/10 p-5 rounded-xl border overflow-hidden">
          <div className="flex justify-between mb-4 items-center">
            <h4 className="font-medium text-sm">Intersectional Bias Amplification</h4>
            <Network className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-xs font-medium mb-3">Single-Dimension Analysis</h5>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-md border">
                  <h6 className="text-xs flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[10px] text-blue-600">G</span>
                    </div>
                    <span>Gender Bias <span className="text-[10px] text-muted-foreground">(When analyzed alone)</span></span>
                  </h6>
                  <div className="w-full bg-muted/30 h-5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '15%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">15% reduction in selection rate for women</p>
                </div>
                
                <div className="p-3 bg-white rounded-md border">
                  <h6 className="text-xs flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-[10px] text-green-600">S</span>
                    </div>
                    <span>Socioeconomic Bias <span className="text-[10px] text-muted-foreground">(When analyzed alone)</span></span>
                  </h6>
                  <div className="w-full bg-muted/30 h-5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">20% reduction for candidates from lower-income backgrounds</p>
                </div>
                
                <div className="p-3 bg-white rounded-md border">
                  <h6 className="text-xs flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-[10px] text-purple-600">E</span>
                    </div>
                    <span>Educational Institution Bias <span className="text-[10px] text-muted-foreground">(When analyzed alone)</span></span>
                  </h6>
                  <div className="w-full bg-muted/30 h-5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">25% reduction for non-elite university graduates</p>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-xs font-medium mb-3">Intersectional Analysis</h5>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-md border">
                  <h6 className="text-xs flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[10px] text-blue-600">G</span>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center -ml-1">
                      <span className="text-[10px] text-green-600">S</span>
                    </div>
                    <span>Gender + Socioeconomic</span>
                  </h6>
                  <div className="w-full bg-muted/30 h-5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">45% reduction for women from lower-income backgrounds</p>
                </div>
                
                <div className="p-3 bg-white rounded-md border">
                  <h6 className="text-xs flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-[10px] text-green-600">S</span>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center -ml-1">
                      <span className="text-[10px] text-purple-600">E</span>
                    </div>
                    <span>Socioeconomic + Educational</span>
                  </h6>
                  <div className="w-full bg-muted/30 h-5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-purple-500" style={{ width: '55%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">55% reduction for lower-income candidates from non-elite universities</p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-md border border-red-200">
                  <h6 className="text-xs flex items-center gap-1.5 mb-2">
                    <div className="h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[10px] text-blue-600">G</span>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center -ml-1">
                      <span className="text-[10px] text-green-600">S</span>
                    </div>
                    <div className="h-4 w-4 rounded-full bg-purple-100 flex items-center justify-center -ml-1">
                      <span className="text-[10px] text-purple-600">E</span>
                    </div>
                    <span>All Three Factors</span>
                  </h6>
                  <div className="w-full bg-muted/30 h-5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">75% reduction for women from lower-income backgrounds attending non-elite universities</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 p-3 bg-muted/10 rounded-md border">
            <h5 className="text-xs font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>The Multiplier Effect</span>
            </h5>
            <p className="text-[10px]">
              When multiple bias factors combine, they don't just add—they multiply. This creates dramatically worse outcomes for people with intersecting marginalized identities, far beyond what single-factor analysis would predict.
            </p>
          </div>
        </div>
      </div>
    ),
    insights: [
      "Biases combine multiplicatively rather than additively",
      "Testing algorithms for single-dimension bias can miss intersectional effects",
      "The most marginalized groups face compounded discrimination",
      "Small biases in multiple dimensions can result in severe discrimination when combined"
    ]
  }
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
      <div className="flex flex-wrap bg-muted/30 border-b">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => handleStepClick(index)}
            className={cn(
              "flex-1 px-3 py-4 text-center text-sm font-medium transition-all min-w-[100px]",
              currentStep === index
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
            )}
          >
            <span className="hidden md:inline">{step.title}</span>
            <span className="md:hidden">{index + 1}</span>
          </button>
        ))}
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            {currentStep + 1}
          </div>
          <h3 className="text-xl md:text-2xl font-bold">{steps[currentStep].title}</h3>
        </div>
        
        <p className="text-muted-foreground">{steps[currentStep].description}</p>
        
        {steps[currentStep].visualization}
        
        <div className="bg-muted/10 p-4 rounded-lg border mt-4">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span>Key Insights</span>
          </h4>
          <ul className="space-y-2">
            {steps[currentStep].insights?.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <span className="text-xs">✓</span>
                </div>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="hover:bg-muted/50"
          >
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-md transition-all"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BiasExplanation;
