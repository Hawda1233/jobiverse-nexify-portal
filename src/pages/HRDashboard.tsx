
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  MoreVertical, 
  Edit, 
  Trash, 
  Eye, 
  Users, 
  Briefcase, 
  LineChart,
  FileText,
  Clock,
  Building,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allJobs, JobType } from "@/lib/jobsData";

const HRDashboard = () => {
  const [myJobs, setMyJobs] = useState<JobType[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in or not an HR user
    if (!userData) {
      navigate("/signin");
      return;
    }
    
    if (userData.role !== "hr") {
      toast({
        title: "Access Denied",
        description: "This area is restricted to HR professionals only.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    // Filter jobs posted by this HR
    // In a real app, you'd fetch this from the backend
    const hrJobs = allJobs.filter(job => job.companyName === userData.company);
    setMyJobs(hrJobs);
  }, [userData, navigate, toast]);

  // Stats for the overview dashboard
  const stats = {
    activeJobs: myJobs.length,
    totalApplications: 28, // Example data
    interviewsScheduled: 8, // Example data
    averageApplicants: myJobs.length ? Math.round(28 / myJobs.length) : 0, // Example calculation
  };

  if (!userData || userData.role !== "hr") {
    return null; // Will be redirected by the useEffect
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">HR Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your job postings and applicants
            </p>
          </div>
          <Button onClick={() => navigate("/post-job")} className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-medium">{userData.company}</h2>
                  <p className="text-sm text-muted-foreground">{userData.industry}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.activeJobs}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.totalApplications}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Interviews Scheduled</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.interviewsScheduled}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Applicants/Job</p>
                      <h3 className="text-2xl font-bold mt-1">{stats.averageApplicants}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest activities on your job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myJobs.length > 0 ? (
                    <>
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">New application received</p>
                          <p className="text-sm text-muted-foreground">For {myJobs[0].title}</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Candidate viewed your job post</p>
                          <p className="text-sm text-muted-foreground">For {myJobs.length > 1 ? myJobs[1].title : myJobs[0].title}</p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No recent activity to display</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Your Job Postings</CardTitle>
                <CardDescription>
                  Manage your active and inactive job listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myJobs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.postedTime}</TableCell>
                          <TableCell>
                            {/* Mocked applicant count */}
                            {Math.floor(Math.random() * 20)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Job
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Job
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start attracting top talent by posting your first job
                    </p>
                    <Button onClick={() => navigate("/post-job")}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post New Job
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>
                  Review and manage candidate applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myJobs.length > 0 ? (
                  <div className="space-y-6">
                    <p className="text-muted-foreground text-center py-8">
                      Applicant tracking system coming soon!<br />
                      We're building tools to help you manage candidates more efficiently.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No applications to review</h3>
                    <p className="text-muted-foreground mb-4">
                      Once you post jobs, candidate applications will appear here
                    </p>
                    <Button onClick={() => navigate("/post-job")}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

export default HRDashboard;
