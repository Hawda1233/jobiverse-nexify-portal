
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  BookOpen, ChevronLeft, Clock, Calendar, 
  Share2, Bookmark, ThumbsUp, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Resource article interface
interface ResourceArticle {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  author: string;
  image?: string;
  tags: string[];
  content: string;
  featured?: boolean;
}

// Resource type mapping
const resourceTypeMapping: Record<string, { title: string, description: string }> = {
  "interview-preparation": {
    title: "Interview Preparation",
    description: "Comprehensive guides and tips to help you ace your technical interviews"
  },
  "resume-tips": {
    title: "Resume Building",
    description: "Expert advice for creating standout technical resumes that get noticed by recruiters"
  },
  "skills-development": {
    title: "Skills Development",
    description: "Resources to help you develop the most in-demand technical skills"
  },
  "career-paths": {
    title: "Career Paths",
    description: "Guidance on various tech career trajectories and growth opportunities in India"
  },
  "industry-trends": {
    title: "Industry Trends",
    description: "Stay updated with the latest trends and technologies in the Indian tech industry"
  },
  "salary-guides": {
    title: "Salary Guides",
    description: "Comprehensive salary information for tech roles across India"
  }
};

// Mock resource articles data
const getMockResourceData = (topic: string): ResourceArticle[] => {
  // Basic articles that would appear for any topic
  const baseArticles: ResourceArticle[] = [
    {
      id: "article-1",
      title: `Essential ${resourceTypeMapping[topic]?.title || "Career"} Guide for Beginners`,
      description: "A comprehensive guide to help you get started on your journey.",
      date: "2024-03-15",
      readTime: "8 min read",
      author: "Priya Sharma",
      tags: ["beginner", "guide", "essential"],
      content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice.",
      featured: true
    },
    {
      id: "article-2",
      title: `Advanced ${resourceTypeMapping[topic]?.title || "Tech"} Strategies`,
      description: "Take your skills to the next level with these advanced techniques.",
      date: "2024-02-28",
      readTime: "12 min read",
      author: "Rahul Mehta",
      tags: ["advanced", "strategies", "professional"],
      content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
    },
    {
      id: "article-3",
      title: `${resourceTypeMapping[topic]?.title || "Career"} Trends in 2024`,
      description: "Stay ahead of the curve with the latest industry trends.",
      date: "2024-01-10",
      readTime: "10 min read",
      author: "Vikram Singh",
      tags: ["trends", "2024", "industry"],
      content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
    }
  ];
  
  // Topic-specific articles
  const topicArticles: Record<string, ResourceArticle[]> = {
    "interview-preparation": [
      {
        id: "interview-1",
        title: "50 Most Common Technical Interview Questions",
        description: "Prepare for your next interview with these frequently asked technical questions.",
        date: "2024-03-10",
        readTime: "15 min read",
        author: "Ananya Desai",
        tags: ["interview", "questions", "technical"],
        content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
      },
      {
        id: "interview-2",
        title: "How to Ace System Design Interviews",
        description: "A step-by-step approach to tackle system design questions.",
        date: "2024-02-15",
        readTime: "18 min read",
        author: "Siddharth Patel",
        tags: ["system design", "architecture", "interview"],
        content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
      }
    ],
    "resume-tips": [
      {
        id: "resume-1",
        title: "Writing an ATS-Friendly Tech Resume",
        description: "Optimize your resume to pass through Applicant Tracking Systems.",
        date: "2024-03-05",
        readTime: "9 min read",
        author: "Neha Kapoor",
        tags: ["ATS", "resume", "optimization"],
        content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
      },
      {
        id: "resume-2",
        title: "Resume Templates for Different Tech Roles",
        description: "Tailored resume formats for developers, data scientists, and more.",
        date: "2024-02-20",
        readTime: "7 min read",
        author: "Arjun Kumar",
        tags: ["templates", "formatting", "roles"],
        content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
      }
    ],
    "skills-development": [
      {
        id: "skills-1",
        title: "Top 10 Programming Languages to Learn in 2024",
        description: "The most in-demand languages that will boost your career.",
        date: "2024-03-12",
        readTime: "11 min read",
        author: "Rohan Malhotra",
        tags: ["programming", "languages", "learning"],
        content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
      },
      {
        id: "skills-2",
        title: "Free Resources to Learn AI and Machine Learning",
        description: "Quality resources that won't cost you a rupee.",
        date: "2024-02-25",
        readTime: "14 min read",
        author: "Sunita Reddy",
        tags: ["AI", "ML", "free", "learning"],
        content: "This is a placeholder for the full article content which would include detailed paragraphs, examples, code snippets if relevant, and actionable advice."
      }
    ]
  };
  
  // If we have topic-specific articles, add them to the base articles
  return [...baseArticles, ...(topicArticles[topic] || [])];
};

const ResourceDetail: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [resources, setResources] = useState<ResourceArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  
  const topicInfo = topic ? resourceTypeMapping[topic] : null;
  
  useEffect(() => {
    if (topic) {
      // Simulate data loading
      setLoading(true);
      setTimeout(() => {
        setResources(getMockResourceData(topic));
        setLoading(false);
      }, 600);
    }
  }, [topic]);

  // Filter resources based on active tab
  const filteredResources = activeTab === "featured" 
    ? resources.filter(r => r.featured) 
    : resources;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20 flex-grow">
        <Link to="/resources">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Resources
          </Button>
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {topicInfo?.title || "Resources"}
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            {topicInfo?.description || "Helpful resources for your tech career"}
          </p>
        </div>
        
        <Tabs defaultValue="featured" className="mb-8">
          <TabsList>
            <TabsTrigger value="featured" onClick={() => setActiveTab("featured")}>
              Featured
            </TabsTrigger>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              All Resources
            </TabsTrigger>
            <TabsTrigger value="latest" onClick={() => setActiveTab("latest")}>
              Latest
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <Card key={resource.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{resource.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{resource.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By {resource.author}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 border-t">
                  <div className="w-full flex justify-between items-center">
                    <Button variant="ghost" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No resources found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any resources for this topic or filter.
            </p>
            <Button onClick={() => setActiveTab("all")}>View All Resources</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ResourceDetail;
