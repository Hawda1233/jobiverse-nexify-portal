
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, BookOpen, FileCheck, Brain, 
  GraduationCap, TrendingUp, DollarSign, Lightbulb 
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

// Resource category interface
interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: number;
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourceCategories.map((category) => (
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
