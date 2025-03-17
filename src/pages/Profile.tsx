
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Award, Briefcase, School, Plus, Trash2, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);
  
  const [activeTab, setActiveTab] = useState("profile");
  
  if (!currentUser) {
    return null; // Don't render anything if not logged in
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileTab currentUser={currentUser} />
          </TabsContent>
          
          <TabsContent value="resume" className="space-y-6">
            <ResumeBuilder />
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <ApplicationsTab />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

const ProfileTab = ({ currentUser }: { currentUser: any }) => {
  const [formData, setFormData] = useState({
    displayName: currentUser.displayName || "",
    email: currentUser.email || "",
    phone: "",
    location: "",
    bio: ""
  });
  
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the user profile in the database here
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully."
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input 
                id="displayName" 
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea 
              id="bio" 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your professional background"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const ResumeBuilder = () => {
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState({
    objective: "",
    skills: [] as string[],
    newSkill: "",
    experiences: [
      { id: 1, company: "", position: "", startDate: "", endDate: "", description: "" }
    ],
    education: [
      { id: 1, institution: "", degree: "", field: "", startDate: "", endDate: "" }
    ]
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillAdd = () => {
    if (resumeData.newSkill.trim() !== "") {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ""
      }));
    }
  };
  
  const handleSkillRemove = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  
  const handleExperienceChange = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  const handleAddExperience = () => {
    const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences, 
        { id: newId, company: "", position: "", startDate: "", endDate: "", description: "" }
      ]
    }));
  };
  
  const handleRemoveExperience = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };
  
  const handleEducationChange = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  const handleAddEducation = () => {
    const newId = Math.max(0, ...resumeData.education.map(e => e.id)) + 1;
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education, 
        { id: newId, institution: "", degree: "", field: "", startDate: "", endDate: "" }
      ]
    }));
  };
  
  const handleRemoveEducation = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  
  const handleSaveResume = () => {
    // In a real app, you would save the resume data to the database
    toast({
      title: "Resume Saved",
      description: "Your resume has been updated successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
          <CardDescription>
            Build a professional resume to showcase your skills and experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Career Objective */}
          <div className="space-y-2">
            <Label htmlFor="objective">Career Objective</Label>
            <Textarea 
              id="objective" 
              name="objective"
              value={resumeData.objective}
              onChange={handleChange}
              placeholder="Briefly describe your career goals and what you're looking for"
              rows={4}
            />
          </div>
          
          {/* Skills */}
          <div className="space-y-4">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="bg-secondary rounded-full px-3 py-1 flex items-center gap-2">
                  <span>{skill}</span>
                  <button 
                    type="button" 
                    onClick={() => handleSkillRemove(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a skill (e.g., JavaScript, Project Management)" 
                value={resumeData.newSkill}
                onChange={(e) => setResumeData(prev => ({ ...prev, newSkill: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
              />
              <Button type="button" onClick={handleSkillAdd} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          
          {/* Work Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Work Experience</Label>
              <Button type="button" onClick={handleAddExperience} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            {resumeData.experiences.map((exp) => (
              <Card key={exp.id} className="border border-muted">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveExperience(exp.id)} 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input 
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input 
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(exp.id, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input 
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input 
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                        placeholder="Present (if current)"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Education</Label>
              <Button type="button" onClick={handleAddEducation} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {resumeData.education.map((edu) => (
              <Card key={edu.id} className="border border-muted">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveEducation(edu.id)} 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input 
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                        placeholder="University or school name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input 
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                        placeholder="Degree type (e.g., Bachelor's, Master's)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input 
                        value={edu.field}
                        onChange={(e) => handleEducationChange(edu.id, 'field', e.target.value)}
                        placeholder="Field of study or major"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input 
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input 
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                          placeholder="Present (if current)"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveResume} className="ml-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Resume
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const ApplicationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>
          Track the status of your job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 text-muted-foreground">
          <Briefcase className="mx-auto h-12 w-12 opacity-30 mb-4" />
          <p>You haven't applied to any jobs yet.</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SettingsTab = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while logging out.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Email Notifications</Label>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications" className="font-normal">
              Receive job alerts and application updates
            </Label>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Account Actions</h3>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Missing import for Router Link and Switch
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

export default Profile;
