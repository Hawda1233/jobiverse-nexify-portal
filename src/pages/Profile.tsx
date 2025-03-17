import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  User, 
  FileText, 
  Award, 
  Briefcase, 
  School, 
  Plus, 
  Trash2, 
  Save, 
  BarChart3,
  Edit,
  Share2,
  Clock,
  Shield,
  Bell,
  Palette,
  Languages,
  Lock, 
  History, 
  LogOut, 
  Eye,
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobApplicationCard, { ApplicationStatus } from "@/components/JobApplicationCard";
import ResumePreview from "@/components/ResumePreview";
import DashboardMetrics from "@/components/DashboardMetrics";
import SkillsForm, { Skill } from "@/components/SkillsForm";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!currentUser) {
    return null; // Don't render anything if not logged in
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
        
        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
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
          
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardTab />
          </TabsContent>
          
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

const DashboardTab = () => {
  // Fix for first click() error - use a proper method to programmatically navigate to tabs
  const handleViewAllApplications = () => {
    const applicationsTab = document.querySelector('[value="applications"]') as HTMLElement;
    if (applicationsTab) {
      applicationsTab.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              Track your job search progress and manage your career development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMetrics />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplications.slice(0, 3).map(app => (
                  <div key={app.id} className="flex justify-between border-b pb-3 last:border-0">
                    <div>
                      <h3 className="font-medium">{app.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm" onClick={handleViewAllApplications} className="w-full">
                View All Applications
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Tomorrow</p>
                    <p className="text-xs text-muted-foreground">10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">UX Designer</h3>
                    <p className="text-sm text-muted-foreground">Creative Solutions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Next Week</p>
                    <p className="text-xs text-muted-foreground">Tuesday, 2:30 PM</p>
                  </div>
                </div>
                <div className="py-6 text-center text-muted-foreground">
                  <p className="text-sm">No other upcoming interviews</p>
                  <Button variant="link" size="sm" className="mt-1">
                    Prepare for interviews
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link to="/interview">
                  Practice Interviews
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Personal Info</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Skills</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Experience</span>
                  <span className="text-sm font-medium">50%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Education</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  const resumeTab = document.querySelector('[value="resume"]') as HTMLElement;
                  if (resumeTab) {
                    resumeTab.click();
                  }
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Complete Resume
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">React Developer</h3>
                    <p className="text-xs text-muted-foreground">95% match</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Frontend Engineer</h3>
                    <p className="text-xs text-muted-foreground">88% match</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">UI Developer</h3>
                    <p className="text-xs text-muted-foreground">82% match</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link to="/jobs">Browse All Jobs</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-xs">View Resume</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <Briefcase className="h-5 w-5 mb-1" />
                  <span className="text-xs">Apply to Jobs</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <School className="h-5 w-5 mb-1" />
                  <span className="text-xs">Courses</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col">
                  <Award className="h-5 w-5 mb-1" />
                  <span className="text-xs">Certifications</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link to="/interview">
                  Practice Interview
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ currentUser }: { currentUser: any }) => {
  const [formData, setFormData] = useState({
    displayName: currentUser.displayName || "",
    email: currentUser.email || "",
    phone: "",
    location: "",
    bio: "",
    jobTitle: "",
    company: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: ""
  });
  
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would update the user profile in the database here
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully."
    });
  };
  
  const initialSkills: Skill[] = [
    { id: 1, name: "React", level: 4, category: "Technical" },
    { id: 2, name: "TypeScript", level: 3, category: "Technical" },
    { id: 3, name: "CSS", level: 4, category: "Technical" },
    { id: 4, name: "Teamwork", level: 5, category: "Soft Skills" },
    { id: 5, name: "Communication", level: 4, category: "Soft Skills" },
  ];
  
  const handleSaveSkills = (skills: Skill[]) => {
    console.log("Saving skills:", skills);
    toast({
      title: "Skills Updated",
      description: "Your skills have been updated successfully."
    });
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSaveProfile}>
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
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g., Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Current Company</Label>
                <Input 
                  id="company" 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name (if applicable)"
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
            
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-medium mb-2">Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input 
                    id="website" 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input 
                    id="linkedin" 
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input 
                    id="github" 
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="GitHub profile URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input 
                    id="twitter" 
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter profile URL"
                  />
                </div>
              </div>
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
      
      <SkillsForm skills={initialSkills} onSave={handleSaveSkills} />
    </div>
  );
};

const ResumeBuilder = () => {
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  
  const [resumeData, setResumeData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    objective: "Experienced frontend developer with a passion for creating intuitive user interfaces and seamless user experiences. Seeking to leverage my skills in a challenging role.",
    skills: ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Git", "Responsive Design", "UI/UX"],
    newSkill: "",
    experiences: [
      { id: 1, company: "Tech Solutions Inc.", position: "Senior Frontend Developer", startDate: "2020-01", endDate: "2023-04", description: "Led the development of the company's main product, implementing new features and improving performance." },
      { id: 2, company: "Web Innovators", position: "Frontend Developer", startDate: "2018-03", endDate: "2019-12", description: "Worked on multiple client projects, focusing on responsive design and cross-browser compatibility." }
    ],
    education: [
      { id: 1, institution: "University of Technology", degree: "Bachelor", field: "Computer Science", startDate: "2014-09", endDate: "2018-05" }
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
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>Resume Builder</CardTitle>
            <CardDescription>
              Build a professional resume to showcase your skills and experience
            </CardDescription>
          </div>
          <div className="ml-auto flex gap-2">
            <Button 
              variant={viewMode === "edit" ? "default" : "outline"} 
              onClick={() => setViewMode("edit")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant={viewMode === "preview" ? "default" : "outline"} 
              onClick={() => setViewMode("preview")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {viewMode === "preview" ? (
        <ResumePreview resumeData={resumeData} />
      ) : (
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={resumeData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    value={resumeData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={resumeData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location"
                    value={resumeData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
            
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
      )}
    </div>
  );
};

// Mock data for job applications
const mockApplications = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    appliedDate: new Date(2023, 6, 15),
    status: "interview" as ApplicationStatus
  },
  {
    id: "2",
    jobTitle: "UX Designer",
    company: "Design Solutions",
    location: "Remote",
    appliedDate: new Date(2023, 6, 10),
    status: "screening" as ApplicationStatus
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "Startup Innovators",
    location: "New York, NY",
    appliedDate: new Date(2023, 6, 5),
    status: "applied" as ApplicationStatus
  },
  {
    id: "4",
    jobTitle: "Frontend Team Lead",
    company: "Enterprise Systems",
    location: "Boston, MA",
    appliedDate: new Date(2023, 5, 20),
    status: "rejected" as ApplicationStatus
  },
  {
    id: "5",
    jobTitle: "JavaScript Developer",
    company: "CodeMasters",
    location: "Chicago, IL",
    appliedDate: new Date(2023, 5, 15),
    status: "offer" as ApplicationStatus
  }
];

const ApplicationsTab = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState(mockApplications);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  
  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    
    toast({
      title: "Application Updated",
      description: `Application status has been updated to ${newStatus}.`
    });
  };
  
  const handleDeleteApplication = (id: string) => {
    setApplications(apps => apps.filter(app => app.id !== id));
    
    toast({
      title: "Application Deleted",
      description: "The job application has been removed from your list."
    });
  };
  
  const filteredApplications = filter === "all" 
    ? applications 
    : applications.filter(app => app.status === filter);
  
  const getStatusCount = (status: ApplicationStatus | "all") => {
    if (status === "all") return applications.length;
    return applications.filter(app => app.status === status).length;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
          <CardDescription>
            Track and manage your job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({getStatusCount("all")})
            </Button>
            <Button 
              variant={filter === "applied" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("applied")}
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
            >
              Applied ({getStatusCount("applied")})
            </Button>
            <Button 
              variant={filter === "screening" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("screening")}
              className="bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900"
            >
              Screening ({getStatusCount("screening")})
            </Button>
            <Button 
              variant={filter === "interview" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("interview")}
              className="bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
            >
              Interview ({getStatusCount("interview")})
            </Button>
            <Button 
              variant={filter === "offer" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("offer")}
              className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
            >
              Offer ({getStatusCount("offer")})
            </Button>
            <Button 
              variant={filter === "accepted" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("accepted")}
              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:text-emerald-900"
            >
              Accepted ({getStatusCount("accepted")})
            </Button>
            <Button 
              variant={filter === "rejected" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("rejected")}
              className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
            >
              Rejected ({getStatusCount("rejected")})
            </Button>
          </div>
          
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map(application => (
                <JobApplicationCard
                  key={application.id}
                  id={application.id}
                  jobTitle={application.jobTitle}
                  company={application.company}
                  location={application.location}
                  appliedDate={application.appliedDate}
                  status={application.status}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteApplication}
                />
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Briefcase className="mx-auto h-12 w-12 opacity-30 mb-4" />
                <p>No {filter !== "all" ? filter : ""} applications found.</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage what notifications you receive via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-jobs">Job Recommendations</Label>
              <p className="text-xs text-muted-foreground">Receive personalized job recommendations based on your profile</p>
            </div>
            <Switch id="notification-jobs" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-applications">Application Updates</Label>
              <p className="text-xs text-muted-foreground">Get notified when there's an update to your job applications</p>
            </div>
            <Switch id="notification-applications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-interviews">Interview Reminders</Label>
              <p className="text-xs text-muted-foreground">Receive reminders about upcoming interviews</p>
            </div>
            <Switch id="notification-interviews" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-network">Network Updates</Label>
              <p className="text-xs text-muted-foreground">Get notified about your network activity and connections</p>
            </div>
            <Switch id="notification-network" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification-marketing">Marketing Communications</Label>
              <p className="text-xs text-muted-foreground">Receive promotional materials, newsletters, and product updates</p>
            </div>
            <Switch id="notification-marketing" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>
            Manage your account security and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Two-Factor Authentication</div>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Setup 2FA
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Change Password</div>
              <p className="text-xs text-muted-foreground">Update your password regularly for better security</p>
            </div>
            <Button variant="outline" size="sm">
              <Lock className="h-4 w-4 mr-2" />
              Change
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Profile Visibility</div>
              <p className="text-xs text-muted-foreground">Control who can see your profile information</p>
            </div>
            <select 
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="public">Public</option>
              <option value="connections">Connections Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Data Privacy</div>
              <p className="text-xs text-muted-foreground">Manage how your data is used and collected</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-selector">Theme</Label>
              <p className="text-xs text-muted-foreground">Select your preferred color theme</p>
            </div>
            <select 
              id="theme-selector"
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="system">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="language-selector">Language</Label>
              <p className="text-xs text-muted-foreground">Select your preferred language</p>
            </div>
            <select 
              id="language-selector"
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="color-preference">Color Accent</Label>
              <p className="text-xs text-muted-foreground">Choose a custom accent color</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-8 h-8 rounded-full bg-blue-500 p-0" />
              <Button size="sm" variant="outline" className="w-8 h-8 rounded-full bg-green-500 p-0" />
              <Button size="sm" variant="outline" className="w-8 h-8 rounded-full bg-purple-500 p-0" />
              <Button size="sm" variant="outline" className="w-8 h-8 rounded-full bg-amber-500 p-0" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start text-amber-600">
            <History className="h-4 w-4 mr-2" />
            Pause Account
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive mt-6">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
