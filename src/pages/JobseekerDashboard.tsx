
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
import { getUserApplications, updateApplicationStatus, deleteApplication } from "@/lib/firestoreOperations";

const JobseekerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Load applications from Firestore
  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const userApps = await getUserApplications(currentUser.uid);
        setApplications(userApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [currentUser, toast]);

  // Redirect to sign-in if no user is authenticated
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Handle status change of an application
  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      
      setApplications(apps => 
        apps.map(app => 
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update failed",
        description: "Could not update application status.",
        variant: "destructive",
      });
    }
  };

  // Handle deletion of an application
  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      setApplications(apps => apps.filter(app => app.id !== id));
      
      toast({
        title: "Application removed",
        description: "The job application has been removed from your dashboard.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Deletion failed",
        description: "Could not remove application.",
        variant: "destructive",
      });
    }
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

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                          id={application.id}
                          jobTitle={application.jobTitle}
                          company={application.companyName}
                          location={application.location || "Remote"}
                          appliedDate={application.appliedDate}
                          status={application.status as ApplicationStatus}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteApplication}
                        />
                      ))}
                      {applications.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No applications yet.</p>
                          <Button className="mt-4" onClick={() => window.location.href = "/jobs"}>
                            Browse Jobs
                          </Button>
                        </div>
                      )}
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
                            id={application.id}
                            jobTitle={application.jobTitle}
                            company={application.companyName}
                            location={application.location || "Remote"}
                            appliedDate={application.appliedDate}
                            status={application.status as ApplicationStatus}
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
                            id={application.id}
                            jobTitle={application.jobTitle}
                            company={application.companyName}
                            location={application.location || "Remote"}
                            appliedDate={application.appliedDate}
                            status={application.status as ApplicationStatus}
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobseekerDashboard;
