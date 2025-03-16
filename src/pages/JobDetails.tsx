
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  BookmarkPlus,
  BriefcaseBusiness,
  Building2,
  Calendar,
  ChevronLeft,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  MapPin,
  Send,
  Share2,
  Star,
  Users
} from 'lucide-react';
import { allJobs } from '@/lib/jobsData';
import { toast } from 'sonner';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);
  
  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      const foundJob = allJobs.find(job => job.id === numericId);
      
      if (foundJob) {
        setJob(foundJob);
        
        // Find similar jobs based on category
        const similar = allJobs
          .filter(j => j.category === foundJob.category && j.id !== numericId)
          .slice(0, 3);
        setSimilarJobs(similar);
      }
      
      setLoading(false);
    }
  }, [id]);
  
  const handleApply = () => {
    toast.success('Application submitted successfully!', {
      description: 'We will notify you when the employer responds.',
    });
  };
  
  const handleSave = () => {
    toast.success('Job saved to your favorites!');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse-subtle text-xl">Loading...</div>
        </main>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Job not found</h2>
            <p className="text-muted-foreground mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/jobs')}>
              Browse other jobs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back navigation */}
          <Link 
            to="/jobs" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to jobs
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Job header */}
              <Card className={job.featured ? "mb-8 border-accent/30 shadow-md relative" : "mb-8"}>
                {job.featured && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-accent text-accent-foreground flex items-center px-3 py-1 gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Featured Job
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-lg ${job.featured ? "bg-accent/10" : "bg-accent/10"} flex items-center justify-center flex-shrink-0`}>
                      <img 
                        src={job.companyLogo || "/placeholder.svg"} 
                        alt={job.companyName}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                      <div className="flex flex-wrap items-center text-muted-foreground gap-2 mb-4">
                        <span className="font-medium text-foreground">{job.companyName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.jobType}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.salary && (
                          <Badge variant="secondary" className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5" />
                            {job.salary}
                          </Badge>
                        )}
                        
                        <Badge variant="secondary" className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Posted {job.postedTime}
                        </Badge>
                        
                        {job.category && (
                          <Badge variant="secondary" className="flex items-center gap-1.5">
                            <BriefcaseBusiness className="h-3.5 w-3.5" />
                            {job.category}
                          </Badge>
                        )}
                        
                        {job.experienceLevel && (
                          <Badge variant="secondary" className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {job.experienceLevel}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={handleApply} className="flex-1 sm:flex-none">
                          Apply Now
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleSave}
                          className="flex items-center gap-2"
                        >
                          <BookmarkPlus className="h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Job details tabs */}
              <Tabs defaultValue="description" className="mb-8">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="neo-blur rounded-xl p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                    <p className="mb-4">{job.description}</p>
                    <p className="mb-4">We are seeking a talented and motivated {job.title} to join our team at {job.companyName}. As a {job.title}, you will be responsible for designing and implementing innovative solutions that drive our company's success.</p>
                    
                    <h4 className="text-lg font-medium mt-6 mb-3">Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Collaborate with cross-functional teams to define, design, and ship new features</li>
                      <li>Ensure the performance, quality, and responsiveness of applications</li>
                      <li>Identify and correct bottlenecks and fix bugs</li>
                      <li>Help maintain code quality, organization, and automatization</li>
                      <li>Participate in code reviews and contribute to team discussions</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium mt-6 mb-3">Benefits:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Competitive salary and bonus opportunities</li>
                      <li>Comprehensive health, dental, and vision insurance</li>
                      <li>401(k) with company match</li>
                      <li>Flexible work arrangements</li>
                      <li>Professional development opportunities</li>
                      <li>Collaborative and innovative work environment</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="requirements" className="neo-blur rounded-xl p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    
                    <h4 className="text-lg font-medium mb-3">Qualifications:</h4>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Bachelor's degree in Computer Science, Engineering, or related field</li>
                      <li>Minimum of {job.experienceLevel === 'Senior Level' ? '5+' : job.experienceLevel === 'Mid Level' ? '3+' : '1+'} years of experience in similar roles</li>
                      <li>Strong proficiency in relevant technologies and tools</li>
                      <li>Excellent problem-solving and analytical skills</li>
                      <li>Effective communication and collaboration abilities</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium mt-6 mb-3">Technical Skills:</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        'JavaScript', 'React', 'TypeScript', 'Node.js', 'GraphQL', 
                        'REST APIs', 'Git', 'Agile Methodologies', 'CI/CD'
                      ].map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-background">{skill}</Badge>
                      ))}
                    </div>
                    
                    <h4 className="text-lg font-medium mt-6 mb-3">Nice to Have:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Experience with cloud platforms (AWS, Azure, GCP)</li>
                      <li>Knowledge of containerization technologies (Docker, Kubernetes)</li>
                      <li>Understanding of DevOps practices</li>
                      <li>Contribution to open-source projects</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="company" className="neo-blur rounded-xl p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">About {job.companyName}</h3>
                    <p className="mb-6">
                      {job.companyName} is a leading company in the {job.category} industry, focused on delivering innovative solutions that transform the way businesses operate. With offices in {job.location} and worldwide, we serve customers across various sectors.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-lg font-medium mb-3">Company Information</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="block text-sm font-medium">Industry</span>
                              <span className="text-muted-foreground">{job.category}</span>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="block text-sm font-medium">Company Size</span>
                              <span className="text-muted-foreground">501-1,000 employees</span>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="block text-sm font-medium">Website</span>
                              <a href="#" className="text-accent hover:underline">www.{job.companyName.toLowerCase().replace(/\s+/g, '')}.com</a>
                            </div>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-medium mb-3">Company Culture</h4>
                        <div className="space-y-2">
                          <Badge variant="outline" className="bg-background mr-2 mb-2">Innovation-driven</Badge>
                          <Badge variant="outline" className="bg-background mr-2 mb-2">Collaborative</Badge>
                          <Badge variant="outline" className="bg-background mr-2 mb-2">Flexible work</Badge>
                          <Badge variant="outline" className="bg-background mr-2 mb-2">Career growth</Badge>
                          <Badge variant="outline" className="bg-background mr-2 mb-2">Diverse & inclusive</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/companies/${job.companyName.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center text-accent hover:underline"
                    >
                      View Company Profile
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply card */}
              <Card className={job.featured ? "border-accent/30" : ""}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Apply for this job</h3>
                  {job.featured && (
                    <Badge className="bg-accent text-accent-foreground mb-4 flex items-center w-fit gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Featured Opportunity
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">
                    Take the next step in your career journey by applying for this role at {job.companyName}.
                  </p>
                  <Button 
                    onClick={handleApply} 
                    className="w-full mb-4"
                  >
                    Apply Now
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Application takes less than 5 minutes
                  </p>
                </CardContent>
              </Card>
              
              {/* Contact card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Have questions?</h3>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Contact Recruiter
                  </Button>
                </CardContent>
              </Card>
              
              {/* Similar jobs */}
              <div className="neo-blur rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
                
                {similarJobs.length > 0 ? (
                  <div className="space-y-4">
                    {similarJobs.map(similarJob => (
                      <div key={similarJob.id} className={similarJob.featured ? "relative" : ""}>
                        {similarJob.featured && (
                          <Badge className="absolute -top-2 right-0 bg-accent text-accent-foreground text-xs px-2 py-0">
                            Featured
                          </Badge>
                        )}
                        <Link 
                          to={`/jobs/${similarJob.id}`}
                          className="block pt-2"
                        >
                          <h4 className="font-medium hover:text-accent transition-colors line-clamp-1">
                            {similarJob.title}
                          </h4>
                          <div className="text-sm text-muted-foreground mb-1">
                            {similarJob.companyName}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {similarJob.location}
                            </span>
                            <span>•</span>
                            <span>{similarJob.jobType}</span>
                          </div>
                        </Link>
                        <Separator className="my-3" />
                      </div>
                    ))}
                    
                    <Link 
                      to={`/jobs?category=${job.category}`}
                      className="text-sm text-accent hover:underline flex items-center"
                    >
                      View all {job.category} jobs
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No similar jobs found at the moment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetails;
