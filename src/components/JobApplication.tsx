
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { applyForJob } from "@/lib/firestoreOperations";
import { useNavigate } from "react-router-dom";

interface JobApplicationProps {
  jobId: string | number;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

const JobApplication = ({ jobId, jobTitle, companyName, onSuccess }: JobApplicationProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to apply for jobs",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const applicationData = {
        coverLetter,
        resume,
        phoneNumber,
        name: userData.displayName || "Anonymous",
        email: userData.email,
        jobTitle,
        companyName,
      };
      
      await applyForJob(jobId.toString(), userData.uid, applicationData);
      
      toast({
        title: "Application Successful",
        description: "Your job application has been submitted successfully!",
      });
      
      setCoverLetter("");
      setResume("");
      setPhoneNumber("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for {jobTitle}</CardTitle>
        <CardDescription>
          Submit your application to {companyName}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume Link</Label>
            <Input
              id="resume"
              placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="Your contact number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're a great fit for this position"
              className="min-h-[150px]"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting Application..." : "Submit Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JobApplication;
