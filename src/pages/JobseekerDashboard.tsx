
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardMetrics from "@/components/DashboardMetrics";
import JobApplicationCard, { ApplicationStatus } from "@/components/JobApplicationCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, ClipboardList, Settings, Calendar } from "lucide-react";
import Scene3D from "@/components/3d/Scene3D";

// Sample job application data
const sampleApplications = [
  {
    id: "job1",
    jobTitle: "Frontend Developer",
    company: "TCS",
    location: "Bangalore, India",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: "interview" as ApplicationStatus
  },
  {
    id: "job2",
    jobTitle: "React Developer",
    company: "Infosys",
    location: "Hyderabad, India",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    status: "screening" as ApplicationStatus
  },
  {
    id: "job3",
    jobTitle: "Full Stack Developer",
    company: "Wipro",
    location: "Pune, India",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    status: "applied" as ApplicationStatus
  }
];

const JobseekerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState(sampleApplications);
  const [activeTab, setActiveTab] = useState("overview");

  // Simulate loading of applications from backend
  useEffect(() => {
    // In a real application, this would fetch data from a backend
    const timer = setTimeout(() => {
      // This simulates applications being loaded from a database
      console.log("Applications loaded");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentUser]);

  // Redirect to sign-in if no user is authenticated
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Handle status change of an application
  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    
    toast({
      title: "Status updated",
      description: `Application status has been updated to ${newStatus}.`,
    });
  };

  // Handle deletion of an application
  const handleDeleteApplication = (id: string) => {
    setApplications(apps => apps.filter(app => app.id !== id));
    
    toast({
      title: "Application removed",
      description: "The job application has been removed from your dashboard.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-28 pb-16 bg-muted/20 relative">
        {/* Background animation */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <Scene3D height="100%" showCharacter={false} showStars={true} />
        </div>

        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your job applications and career progress
            </p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-background rounded-lg p-4 mb-6 shadow-sm">
              <TabsList className="grid grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span>Applications</span>
                </TabsTrigger>
                <TabsTrigger value="interviews" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Interviews</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-background p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Job Search Overview</h2>
                  <DashboardMetrics />
                </div>
                
                <div className="bg-background p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Applications</h2>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("applications")}>
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {applications.slice(0, 2).map(application => (
                      <JobApplicationCard
                        key={application.id}
                        {...application}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteApplication}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">All Applications</h2>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {applications.length > 0 ? (
                      applications.map(application => (
                        <JobApplicationCard
                          key={application.id}
                          {...application}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteApplication}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No applications yet.</p>
                        <Button className="mt-4" onClick={() => window.location.href = "/jobs"}>
                          Browse Jobs
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="interviews">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status === "interview")
                      .map(application => (
                        <JobApplicationCard
                          key={application.id}
                          {...application}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteApplication}
                        />
                      ))}
                    {applications.filter(app => app.status === "interview").length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No upcoming interviews.</p>
                        <Button className="mt-4" onClick={() => window.location.href = "/interview"}>
                          Practice Interview
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Dashboard Settings</h2>
                <p className="text-muted-foreground">
                  Settings for your dashboard are coming soon. For now, you can update your profile information on the profile page.
                </p>
                <div className="mt-4">
                  <Button onClick={() => window.location.href = "/profile"}>
                    Go to Profile
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobseekerDashboard;
