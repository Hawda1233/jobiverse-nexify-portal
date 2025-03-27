
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobApplicationCard, { ApplicationStatus } from "@/components/JobApplicationCard";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { getUserApplications, updateApplicationStatus, deleteApplication } from "@/lib/firestoreOperations";

const Applications = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load applications from Firestore
  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const userApps = await getUserApplications(currentUser.uid);
        setApplications(userApps);
        setFilteredApplications(userApps);
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

  // Filter applications based on search term and status
  useEffect(() => {
    let filtered = applications;
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

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
        description: "The job application has been removed from your list.",
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

  // Generate status counts for badges
  const getStatusCounts = () => {
    const counts = {
      all: applications.length,
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      accepted: 0,
      rejected: 0
    };
    
    applications.forEach(app => {
      if (app.status && counts[app.status as keyof typeof counts] !== undefined) {
        counts[app.status as keyof typeof counts] += 1;
      }
    });
    
    return counts;
  };
  
  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage all your job applications
            </p>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-background p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search applications..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Applications
                        <Badge variant="outline" className="ml-2">{statusCounts.all}</Badge>
                      </SelectItem>
                      <SelectItem value="applied">
                        Applied
                        <Badge variant="outline" className="ml-2">{statusCounts.applied}</Badge>
                      </SelectItem>
                      <SelectItem value="screening">
                        Screening
                        <Badge variant="outline" className="ml-2">{statusCounts.screening}</Badge>
                      </SelectItem>
                      <SelectItem value="interview">
                        Interview
                        <Badge variant="outline" className="ml-2">{statusCounts.interview}</Badge>
                      </SelectItem>
                      <SelectItem value="offer">
                        Offer
                        <Badge variant="outline" className="ml-2">{statusCounts.offer}</Badge>
                      </SelectItem>
                      <SelectItem value="accepted">
                        Accepted
                        <Badge variant="outline" className="ml-2">{statusCounts.accepted}</Badge>
                      </SelectItem>
                      <SelectItem value="rejected">
                        Rejected
                        <Badge variant="outline" className="ml-2">{statusCounts.rejected}</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map(application => (
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
                      <p className="text-muted-foreground">
                        {applications.length > 0
                          ? "No applications matching your filters."
                          : "You haven't applied to any jobs yet."}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Applications;
