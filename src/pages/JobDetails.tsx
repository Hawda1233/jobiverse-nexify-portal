
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { JobApplication } from "@/components/JobApplication";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  Banknote, 
  GraduationCap,
  Share2,
  Bookmark,
  ExternalLink,
  Loader2
} from "lucide-react";
import { JobType } from "@/lib/jobsData";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const jobRef = doc(db, "jobs", id);
        const jobSnap = await getDoc(jobRef);
        
        if (jobSnap.exists()) {
          const data = jobSnap.data();
          setJob({
            id: parseInt(id),
            title: data.title,
            companyName: data.companyName,
            location: data.location,
            jobType: data.jobType,
            salary: data.salary,
            category: data.category,
            description: data.description,
            postedTime: formatPostedTime(data.createdAt.toDate()),
            experienceLevel: data.experienceLevel,
            featured: data.featured,
            postedBy: data.postedBy,
          });
        } else {
          console.log("No such job document!");
          toast({
            title: "Job Not Found",
            description: "The job listing you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, toast]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job listing URL copied to clipboard",
    });
  };

  const handleSave = () => {
    if (!userData) {
      toast({
        title: "Sign in Required",
        description: "Please sign in to save jobs",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    // Here we'd normally save to a user's saved jobs collection
    toast({
      title: "Job Saved",
      description: "This job has been added to your saved list",
    });
  };

  const handleApplySuccess = () => {
    setShowApplication(false);
    toast({
      title: "Application Submitted",
      description: "Your application has been sent successfully!",
    });
  };

  // Helper function to format the posted date
  const formatPostedTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-xl font-medium mb-2">Job Not Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              The job listing you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/jobs")}>
              Browse All Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              {job.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 self-start mb-2">
                  Featured
                </Badge>
              )}
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{job.companyName}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {job.postedTime}</span>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                <div className="neo-blur rounded-lg p-4 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.jobType}</p>
                  </div>
                </div>
                
                <div className="neo-blur rounded-lg p-4 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{job.experienceLevel}</p>
                  </div>
                </div>
                
                <div className="neo-blur rounded-lg p-4 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{job.salary || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="neo-blur rounded-lg p-4 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{job.category}</p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="description" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-4">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-3">Job Description</h3>
                    <p className="whitespace-pre-line">{job.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="company">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-3">About {job.companyName}</h3>
                    <p>
                      {job.companyName} is a leading company in the {job.category} industry. 
                      For more information about the company and to see other jobs they have posted, 
                      please visit their company page.
                    </p>
                    
                    <Button variant="outline" className="mt-4" asChild>
                      <a href={`/companies/${encodeURIComponent(job.companyName)}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Company Profile
                      </a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Apply Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply for this position</CardTitle>
              <CardDescription>
                Submit your application for {job.title} at {job.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => setShowApplication(true)}
                disabled={userData?.role === "hr"}
              >
                Apply Now
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={handleSave}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              {userData?.role === "hr" && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  As an HR user, you cannot apply to jobs. 
                  Sign in with a candidate account to apply.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Looking for other opportunities similar to this one?
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/jobs?category=${encodeURIComponent(job.category)}`}>
                    View Similar Jobs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Job Application Dialog */}
      <Dialog open={showApplication} onOpenChange={setShowApplication}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Complete the application form to apply for this position at {job.companyName}
            </DialogDescription>
          </DialogHeader>
          
          <JobApplication 
            jobId={job.id} 
            jobTitle={job.title} 
            companyName={job.companyName} 
            onSuccess={handleApplySuccess} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetails;
