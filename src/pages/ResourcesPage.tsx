
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, BookOpen, FileCheck, Brain, 
  GraduationCap, TrendingUp, DollarSign, Lightbulb, Building
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Resource category interface
interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: number;
}

// Company study material interface
interface CompanyStudyMaterial {
  id: number;
  name: string;
  logo: string;
  resources: number;
  description: string;
}

const ResourcesPage: React.FC = () => {
  // Resource categories with their descriptions
  const resourceCategories: ResourceCategory[] = [
    {
      id: "interview-preparation",
      title: "Interview Preparation",
      description: "Ace your next tech interview with comprehensive guides, common questions, and expert tips.",
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      articles: 12
    },
    {
      id: "resume-tips",
      title: "Resume Building",
      description: "Create a standout technical resume that showcases your skills and experience effectively.",
      icon: <FileCheck className="h-8 w-8 text-primary" />,
      articles: 8
    },
    {
      id: "skills-development",
      title: "Skills Development",
      description: "Learn the most in-demand technical skills through curated tutorials, courses, and resources.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      articles: 15
    },
    {
      id: "career-paths",
      title: "Career Paths",
      description: "Explore various career trajectories in the Indian tech industry and plan your professional growth.",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      articles: 10
    },
    {
      id: "industry-trends",
      title: "Industry Trends",
      description: "Stay updated with the latest technologies, frameworks, and practices in the tech industry.",
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      articles: 9
    },
    {
      id: "salary-guides",
      title: "Salary Guides",
      description: "Comprehensive salary information and negotiation tips for tech roles across India.",
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      articles: 7
    },
    {
      id: "company-materials",
      title: "Company Study Materials",
      description: "Specialized preparation resources and interview patterns for top tech companies in India.",
      icon: <Building className="h-8 w-8 text-primary" />,
      articles: 10
    }
  ];

  // Company-specific study materials
  const companyStudyMaterials: CompanyStudyMaterial[] = [
    { 
      id: 1, 
      name: 'Tata Consultancy Services', 
      logo: '/tcs.svg',
      resources: 8,
      description: "Prepare for TCS interviews with role-specific material and coding tests."
    },
    { 
      id: 2, 
      name: 'Infosys', 
      logo: '/infosys.svg',
      resources: 7,
      description: "Study guides for Infosys technical and HR interview rounds."
    },
    { 
      id: 3, 
      name: 'Wipro', 
      logo: '/wipro.svg',
      resources: 6,
      description: "Wipro interview patterns and preparation strategies."
    },
    { 
      id: 4, 
      name: 'HCL Technologies', 
      logo: '/hcl.svg',
      resources: 5,
      description: "Technical assessment guides for HCL recruitment process."
    },
    { 
      id: 5, 
      name: 'Tech Mahindra', 
      logo: '/techmahindra.svg',
      resources: 4,
      description: "Interview preparation for Tech Mahindra positions."
    },
    { 
      id: 6, 
      name: 'Accenture', 
      logo: '/accenture.svg',
      resources: 9,
      description: "Complete guide to Accenture's multi-stage interview process."
    },
    { 
      id: 7, 
      name: 'Cognizant', 
      logo: '/cognizant.svg',
      resources: 6,
      description: "Cognizant technical assessment and interview tips."
    },
    { 
      id: 8, 
      name: 'Capgemini', 
      logo: '/capgemini.svg',
      resources: 5,
      description: "Preparation material for Capgemini hiring challenges."
    },
    { 
      id: 9, 
      name: 'IBM India', 
      logo: '/ibm.svg',
      resources: 7,
      description: "IBM assessment strategies and interview preparation."
    },
    { 
      id: 10, 
      name: 'Microsoft India', 
      logo: '/microsoft.svg',
      resources: 10,
      description: "In-depth guides for Microsoft's technical and behavioral interviews."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Career Resources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides, tools, and articles to help you navigate your tech career journey in India
          </p>
        </div>

        <Tabs defaultValue="general" className="mb-12">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="general" className="flex-1">General Resources</TabsTrigger>
            <TabsTrigger value="company" className="flex-1">Company-Specific</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceCategories.filter(cat => cat.id !== "company-materials").map((category) => (
                <Link key={category.id} to={`/resources/${category.id}`} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        {category.icon}
                        <span className="text-sm text-muted-foreground">
                          {category.articles} Articles
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription>
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="group-hover:bg-primary/10 transition-colors w-full justify-between">
                        Explore Resources
                        <BookOpen className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="company">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Building className="h-6 w-6 mr-2 text-primary" />
                Company Study Materials
              </h2>
              <p className="text-muted-foreground mb-6">
                Specialized preparation resources for interviews at leading tech companies in India. Each guide includes company-specific interview patterns, technical assessments, and HR preparation tips.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyStudyMaterials.map((company) => (
                <Link key={company.id} to={`/resources/company/${company.id}`} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {company.resources} Resources
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {company.name}
                      </CardTitle>
                      <CardDescription>
                        {company.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="group-hover:bg-primary/10 transition-colors w-full justify-between">
                        View Study Materials
                        <BookOpen className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-muted/30 rounded-lg p-8 border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
                Personalized Career Advice
              </h2>
              <p className="text-muted-foreground mb-4">
                Not sure where to start? Get customized guidance based on your skills, 
                experience, and career goals from our AI-powered career assistant.
              </p>
              <Button className="mt-2">
                Get Career Recommendations
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <img 
                src="/placeholder.svg" 
                alt="Career Guidance" 
                className="max-w-full h-auto rounded-lg"
                width={300}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
