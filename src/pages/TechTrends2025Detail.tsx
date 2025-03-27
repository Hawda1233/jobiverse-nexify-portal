
import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Cpu, Download, Share2, Bookmark,
  CheckCircle, Brain, Globe, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TechTrends2025Detail = () => {
  const { section } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link to="/resources" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Tech Trends 2025</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            A comprehensive analysis of emerging technologies and trends that will shape the industry landscape by 2025.
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai">AI & ML</TabsTrigger>
            <TabsTrigger value="quantum">Quantum Computing</TabsTrigger>
            <TabsTrigger value="xr">Extended Reality</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                  <div className="prose max-w-none">
                    <p>
                      The technology landscape is undergoing rapid transformation, with several key trends poised to 
                      reshape industries and society by 2025. This report identifies the most significant developments 
                      in artificial intelligence, quantum computing, extended reality, and sustainable technology.
                    </p>
                    <p>
                      Organizations that position themselves strategically to harness these emerging technologies 
                      will gain significant competitive advantages. This report provides a comprehensive analysis of 
                      each trend, including potential applications, impact on the workforce, and recommendations for 
                      business leaders and technology professionals.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Key Findings</h2>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">AI Will Move Beyond Pattern Recognition</h3>
                        <p className="text-muted-foreground">
                          Artificial intelligence will evolve from pattern recognition to more advanced cognitive tasks,
                          including creative problem-solving and autonomous decision-making in complex environments.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Quantum Computing Will Begin Delivering Practical Value</h3>
                        <p className="text-muted-foreground">
                          Early commercial applications of quantum computing will emerge, particularly in pharmaceutical 
                          research, materials science, and logistics optimization.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Extended Reality Will Transform Collaboration</h3>
                        <p className="text-muted-foreground">
                          AR and VR technologies will move beyond entertainment to become essential tools for remote 
                          collaboration, training, and customer engagement across industries.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Sustainable Technology Will Drive Innovation</h3>
                        <p className="text-muted-foreground">
                          Environmental concerns will accelerate the development of green technologies, including more 
                          efficient energy storage, carbon capture, and sustainable materials.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Technology Impact by Sector</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          Healthcare
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Precision medicine, AI diagnostics, robotic surgery, remote care, bioprinting
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          Finance
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Quantum cryptography, AI advisory, decentralized finance, automated compliance
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Manufacturing
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Digital twins, autonomous factories, sustainable production, additive manufacturing
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-primary" />
                          Education
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Personalized learning, immersive experiences, skills-based credentialing, lifelong learning platforms
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button className="w-full">
                        Download Full Industry Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Artificial Intelligence & Machine Learning</h2>
              <p className="text-muted-foreground">
                By 2025, AI will undergo significant evolution, transitioning from primarily pattern-recognition systems to more advanced cognitive capabilities.
              </p>
              
              <div className="prose max-w-none">
                <h3>Key Developments</h3>
                <ul>
                  <li><strong>Multimodal AI:</strong> Systems that can process and understand multiple types of data (text, images, audio) simultaneously.</li>
                  <li><strong>AI-Driven Creativity:</strong> Advanced generative models for content creation across mediums.</li>
                  <li><strong>Autonomous Systems:</strong> AI that can operate independently in complex, unpredictable environments.</li>
                  <li><strong>Edge AI:</strong> More powerful AI processing on edge devices, reducing dependence on cloud computing.</li>
                  <li><strong>AI Governance:</strong> Maturation of frameworks for responsible AI development and deployment.</li>
                </ul>
                
                <h3>Impact on Work</h3>
                <p>
                  AI will augment human capabilities across industries, automating routine analytical tasks while creating new roles focused on 
                  AI system design, ethics, and supervision. Key skills will include prompt engineering, AI system integration, and AI ethics.
                </p>
                
                <h3>Recommendations</h3>
                <p>
                  Organizations should develop comprehensive AI strategies that include ethical guidelines, talent development, and change management. 
                  Professionals should focus on developing complementary skills that AI cannot easily replicate, such as creative problem-solving, 
                  interdisciplinary thinking, and complex decision-making.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quantum">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Quantum Computing</h2>
              <p className="text-muted-foreground">
                By 2025, quantum computing will begin to transition from primarily research-focused to early commercial applications, delivering value in specific domains.
              </p>
              
              <div className="prose max-w-none">
                <h3>Key Developments</h3>
                <ul>
                  <li><strong>Error Correction Advancements:</strong> Significant progress in quantum error correction, enabling more stable and reliable quantum computations.</li>
                  <li><strong>Specialized Quantum Applications:</strong> Industry-specific quantum algorithms for pharmaceuticals, materials science, and logistics.</li>
                  <li><strong>Quantum-Classical Hybrid Systems:</strong> Practical systems that leverage both quantum and classical computing capabilities.</li>
                  <li><strong>Quantum Machine Learning:</strong> Novel quantum algorithms for machine learning tasks that outperform classical approaches for specific problems.</li>
                </ul>
                
                <h3>Impact on Work</h3>
                <p>
                  Quantum computing will create demand for specialists who understand both quantum mechanics and computer science principles. 
                  Interdisciplinary roles will emerge at the intersection of quantum computing and domain expertise in chemistry, finance, 
                  and logistics.
                </p>
                
                <h3>Recommendations</h3>
                <p>
                  Organizations should identify potential quantum use cases specific to their industry and begin building quantum literacy 
                  within their technical teams. Technologists should develop foundational knowledge in quantum computing concepts and follow 
                  the development of quantum programming frameworks.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="xr">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Extended Reality (XR)</h2>
              <p className="text-muted-foreground">
                AR, VR, and mixed reality technologies will become more integrated into professional workflows and everyday experiences.
              </p>
              
              <div className="prose max-w-none">
                <h3>Key Developments</h3>
                <ul>
                  <li><strong>Lightweight, All-Day Wearables:</strong> More comfortable AR glasses and VR headsets suitable for extended use.</li>
                  <li><strong>Spatial Computing:</strong> Environments that blend digital and physical elements seamlessly.</li>
                  <li><strong>Virtual Collaboration:</strong> Immersive remote work platforms that simulate physical presence.</li>
                  <li><strong>Digital Twins:</strong> Complex XR representations of physical systems for simulation and control.</li>
                  <li><strong>Ambient AR:</strong> Contextual information overlays that appear based on user needs and environment.</li>
                </ul>
                
                <h3>Impact on Work</h3>
                <p>
                  XR will transform how teams collaborate remotely, how training is conducted, and how products are designed and visualized. 
                  New roles will emerge in spatial design, XR user experience, and virtual environment management.
                </p>
                
                <h3>Recommendations</h3>
                <p>
                  Organizations should begin piloting XR solutions for training and collaboration use cases. Professionals should develop 
                  skills in spatial design thinking and understand the unique interaction patterns of XR interfaces.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sustainability">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Sustainable Technology</h2>
              <p className="text-muted-foreground">
                Environmental concerns will drive innovation in green technologies across energy, materials, and processes.
              </p>
              
              <div className="prose max-w-none">
                <h3>Key Developments</h3>
                <ul>
                  <li><strong>Advanced Energy Storage:</strong> More efficient and sustainable battery technologies and alternative storage methods.</li>
                  <li><strong>Carbon Capture & Utilization:</strong> Scalable methods to remove and repurpose atmospheric carbon.</li>
                  <li><strong>Sustainable Computing:</strong> More energy-efficient hardware and software optimization techniques.</li>
                  <li><strong>Circular Economy Technologies:</strong> Systems for product design, tracking, and recycling that minimize waste.</li>
                  <li><strong>Climate Analytics:</strong> AI-powered systems for environmental monitoring and climate modeling.</li>
                </ul>
                
                <h3>Impact on Work</h3>
                <p>
                  Sustainability considerations will become integrated across all technology roles. New specialized positions will focus on 
                  sustainable system design, environmental impact assessment, and green technology implementation.
                </p>
                
                <h3>Recommendations</h3>
                <p>
                  Organizations should establish sustainability as a core principle in technology strategies and evaluate the environmental 
                  impact of their digital operations. Technology professionals should develop knowledge of sustainable design principles 
                  and how to optimize systems for energy efficiency.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechTrends2025Detail;
