
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { JobApplicationCard, ApplicationStatus } from "@/components/JobApplicationCard";
import { getUserApplications, updateApplicationStatus, deleteApplication } from "@/lib/firestoreOperations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Briefcase, Calendar, Loader2 } from "lucide-react";

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: Date;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!userData) {
      navigate("/signin");
      return;
    }

    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const userApps = await getUserApplications(userData.uid);
        const formattedApps = userApps.map((app: any) => ({
          id: app.id,
          jobId: app.jobId,
          jobTitle: app.jobTitle || "Untitled Position",
          companyName: app.companyName || "Unknown Company",
          location: app.location || "Remote",
          status: app.status || "applied",
          appliedDate: app.appliedDate || new Date(),
        }));
        
        setApplications(formattedApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [userData, navigate, toast]);

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      
      toast({
        title: "Status Updated",
        description: `Application marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
      
      setApplications(applications.filter(app => app.id !== id));
      
      toast({
        title: "Application Deleted",
        description: "The application has been removed from your list.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the application. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter applications based on active tab
  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return ["applied", "screening", "interview"].includes(app.status);
    if (activeTab === "closed") return ["offer", "accepted", "rejected"].includes(app.status);
    return true;
  });

  // Get counts for each tab
  const counts = {
    all: applications.length,
    active: applications.filter(app => ["applied", "screening", "interview"].includes(app.status)).length,
    closed: applications.filter(app => ["offer", "accepted", "rejected"].includes(app.status)).length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your job applications
          </p>
        </div>
        <Button onClick={() => navigate("/jobs")}>
          <Briefcase className="mr-2 h-4 w-4" />
          Browse Jobs
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all" className="flex flex-col py-2">
            <span>All</span>
            <span className="text-xs text-muted-foreground">{counts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex flex-col py-2">
            <span>Active</span>
            <span className="text-xs text-muted-foreground">{counts.active}</span>
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex flex-col py-2">
            <span>Closed</span>
            <span className="text-xs text-muted-foreground">{counts.closed}</span>
          </TabsTrigger>
        </TabsList>

        {/* Applications grid for all tabs */}
        <TabsContent value={activeTab}>
          {filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application) => (
                <JobApplicationCard
                  key={application.id}
                  id={application.jobId}
                  jobTitle={application.jobTitle}
                  company={application.companyName}
                  location={application.location}
                  appliedDate={application.appliedDate}
                  status={application.status}
                  onStatusChange={handleStatusChange}
                  onDelete={() => handleDeleteApplication(application.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {activeTab === "all" 
                    ? "You haven't applied to any jobs yet. Start your job search today!" 
                    : activeTab === "active" 
                      ? "You don't have any active applications. Apply to more jobs!" 
                      : "You don't have any closed applications. Check back after you've received responses."}
                </p>
                <Button onClick={() => navigate("/jobs")}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Applications;
