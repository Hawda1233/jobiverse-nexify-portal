
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BookmarkPlus, Clock, MapPin, Building, Briefcase, Award, Calendar, DollarSign, Share2 } from "lucide-react";
import { allJobs } from "@/lib/jobsData";
import JobApplication from "@/components/JobApplication";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        // First try to get from Firestore
        if (id) {
          const docRef = doc(db, "jobs", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setJob({
              id: docSnap.id,
              title: data.title,
              companyName: data.companyName,
              location: data.location,
              jobType: data.jobType,
              salary: data.salary,
              category: data.category,
              description: data.description,
              postedTime: data.postedTime || "Recently",
              experienceLevel: data.experienceLevel,
              featured: data.featured,
              postedBy: data.postedBy,
            });
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to sample data
        const foundJob = allJobs.find(job => job.id.toString() === id);
        if (foundJob) {
          setJob(foundJob);
        } else {
          toast({
            title: "Job Not Found",
            description: "The job you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJob();
  }, [id, toast]);

  const handleApplyClick = () => {
    setShowApplication(!showApplication);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      <Link to={`/companies/${job.companyName}`} className="hover:text-primary transition-colors">
                        {job.companyName}
                      </Link>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.postedTime}
                    </div>
                  </div>
                </div>
                <div className="flex mt-4 md:mt-0">
                  <Button variant="outline" size="sm" className="mr-2">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="flex items-center">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {job.jobType}
                </Badge>
                <Badge variant="secondary" className="flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  {job.experienceLevel}
                </Badge>
                {job.salary && (
                  <Badge variant="secondary" className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {job.salary}
                  </Badge>
                )}
                <Badge variant="secondary" className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Apply by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Badge>
              </div>

              <Tabs defaultValue="description">
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Job Description</TabsTrigger>
                  <TabsTrigger value="company">Company Info</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4">
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    <p>{job.description}</p>
                    
                    <h3 className="text-lg font-semibold mb-2 mt-6">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Design and implement new features and functionality</li>
                      <li>Build reusable code and libraries for future use</li>
                      <li>Ensure the technical feasibility of UI/UX designs</li>
                      <li>Optimize application for maximum speed and scalability</li>
                      <li>Collaborate with other team members and stakeholders</li>
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-2 mt-6">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Proficient in HTML, CSS, and JavaScript</li>
                      <li>Experience with React.js and its core principles</li>
                      <li>Experience with modern frontend build pipelines and tools</li>
                      <li>Familiarity with RESTful APIs and modern authorization mechanisms</li>
                      <li>Good understanding of asynchronous request handling and partial page updates</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="company">
                  <div className="prose max-w-none">
                    <p>
                      {job.companyName} is a dynamic and innovative company focused on providing cutting-edge solutions in the {job.category} industry. 
                      With a strong emphasis on growth and employee development, we offer a collaborative and inclusive work environment.
                    </p>
                    <Link to={`/companies/${job.companyName}`} className="text-primary hover:underline inline-flex items-center mt-4">
                      Learn more about {job.companyName}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Apply for this position</h2>
                <Button onClick={handleApplyClick} className="w-full">
                  {showApplication ? "Hide Application Form" : "Apply Now"}
                </Button>
                
                {showApplication && (
                  <div className="mt-6">
                    <Separator className="my-6" />
                    <JobApplication 
                      jobId={job.id}
                      jobTitle={job.title}
                      companyName={job.companyName}
                      onSuccess={() => setShowApplication(false)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Summary</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.jobType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience Level</p>
                    <p className="font-medium">{job.experienceLevel}</p>
                  </div>
                  {job.salary && (
                    <div>
                      <p className="text-sm text-muted-foreground">Salary Range</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{job.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import for the arrow icon
import { ArrowRight } from "lucide-react";

export default JobDetails;
