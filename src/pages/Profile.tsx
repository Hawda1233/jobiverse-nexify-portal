import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Eye,
  Download,
  FileCheck,
  Code2,
  Users,
  Trophy,
  Heart,
  Settings,
  BookOpen,
  Share2,
  Printer,
  Languages
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobApplicationCard, { ApplicationStatus } from "@/components/JobApplicationCard";
import ResumePreview from "@/components/ResumePreview";
import DashboardMetrics from "@/components/DashboardMetrics";
import SkillsForm, { Skill } from "@/components/SkillsForm";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

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
    ],
    certifications: [
      { id: 1, name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2022-06", expiry: "2025-06" }
    ],
    projects: [
      { id: 1, title: "E-commerce Platform", description: "Built a full-featured e-commerce platform with React and Node.js", link: "https://github.com/johndoe/ecommerce" }
    ],
    languages: [
      { id: 1, name: "English", proficiency: "Native" },
      { id: 2, name: "Spanish", proficiency: "Intermediate" }
    ],
    references: [
      { id: 1, name: "Jane Smith", position: "Engineering Manager", company: "Tech Solutions Inc.", email: "jane.smith@example.com", phone: "(555) 987-6543" }
    ],
    achievements: "",
    hobbies: "",
    customSections: []
  });
  
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [resumeTheme, setResumeTheme] = useState<string>("modern");
  const [fontFamily, setFontFamily] = useState<string>("Inter");
  
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
  
  // Certification handlers
  const handleCertificationChange = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };
  
  const handleAddCertification = () => {
    const newId = Math.max(0, ...resumeData.certifications.map(c => c.id), 0) + 1;
    setResumeData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications, 
        { id: newId, name: "", issuer: "", date: "", expiry: "" }
      ]
    }));
  };
  
  const handleRemoveCertification = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };
  
  // Project handlers
  const handleProjectChange = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };
  
  const handleAddProject = () => {
    const newId = Math.max(0, ...resumeData.projects.map(p => p.id), 0) + 1;
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects, 
        { id: newId, title: "", description: "", link: "" }
      ]
    }));
  };
  
  const handleRemoveProject = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };
  
  // Language handlers
  const handleLanguageChange = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };
  
  const handleAddLanguage = () => {
    const newId = Math.max(0, ...resumeData.languages.map(l => l.id), 0) + 1;
    setResumeData(prev => ({
      ...prev,
      languages: [
        ...prev.languages, 
        { id: newId, name: "", proficiency: "Beginner" }
      ]
    }));
  };
  
  const handleRemoveLanguage = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };
  
  // Reference handlers
  const handleReferenceChange = (id: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      references: prev.references.map(ref => 
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    }));
  };
  
  const handleAddReference = () => {
    const newId = Math.max(0, ...resumeData.references.map(r => r.id), 0) + 1;
    setResumeData(prev => ({
      ...prev,
      references: [
        ...prev.references, 
        { id: newId, name: "", position: "", company: "", email: "", phone: "" }
      ]
    }));
  };
  
  const handleRemoveReference = (id: number) => {
    setResumeData(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== id)
    }));
  };
  
  const handleSaveResume = () => {
    // In a real app, you would save the resume data to the database
    toast({
      title: "Resume Saved",
      description: "Your resume has been updated successfully."
    });
  };
  
  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Your resume is being exported as a PDF. It will download shortly."
    });
    // In a real app, this would trigger a PDF download
  };
  
  // Resume Themes
  const resumeThemes = [
    { id: "modern", name: "Modern" },
    { id: "classic", name: "Classic" },
    { id: "minimal", name: "Minimal" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" }
  ];
  
  // Font Families
  const fontFamilies = [
    { id: "Inter", name: "Inter" },
    { id: "Roboto", name: "Roboto" },
    { id: "Open Sans", name: "Open Sans" },
    { id: "Montserrat", name: "Montserrat" },
    { id: "Playfair", name: "Playfair Display" }
  ];
  
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
        <div className="space-y-4">
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Theme:</Label>
                    <select 
                      className="border rounded p-1"
                      value={resumeTheme}
                      onChange={(e) => setResumeTheme(e.target.value)}
                    >
                      {resumeThemes.map(theme => (
                        <option key={theme.id} value={theme.id}>{theme.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Font:</Label>
                    <select 
                      className="border rounded p-1"
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                    >
                      {fontFamilies.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ResumePreview resumeData={resumeData} theme={resumeTheme} font={fontFamily} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar - Resume sections navigation */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button 
                  variant={activeTab === "personal" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("personal")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </Button>
                <Button 
                  variant={activeTab === "objective" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("objective")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Professional Summary
                </Button>
                <Button 
                  variant={activeTab === "skills" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("skills")}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Skills
                </Button>
                <Button 
                  variant={activeTab === "experience" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("experience")}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Work Experience
                </Button>
                <Button 
                  variant={activeTab === "education" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("education")}
                >
                  <School className="h-4 w-4 mr-2" />
                  Education
                </Button>
                <Button 
                  variant={activeTab === "certifications" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("certifications")}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Certifications
                </Button>
                <Button 
                  variant={activeTab === "projects" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("projects")}
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  Projects
                </Button>
                <Button 
                  variant={activeTab === "languages" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("languages")}
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Languages
                </Button>
                <Button 
                  variant={activeTab === "references" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("references")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  References
                </Button>
                <Button 
                  variant={activeTab === "achievements" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("achievements")}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </Button>
                <Button 
                  variant={activeTab === "hobbies" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("hobbies")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Hobbies & Interests
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Resume Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Right content area - Form fields for the selected section */}
          <Card className="md:col-span-3">
            <CardContent className="space-y-6 pt-6">
              {/* Personal Information */}
              {activeTab === "personal" && (
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
              )}
              
              {/* Professional Summary */}
              {activeTab === "objective" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Professional Summary</h3>
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
                </div>
              )}
              
              {/* Skills */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skills</h3>
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
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Popular Skills by Industry</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setResumeData(prev => ({ ...prev, skills: [...new Set([...prev.skills, "React", "TypeScript", "JavaScript", "HTML", "CSS"])] }))} size="sm" variant="outline">+ Web Development</Button>
                      <Button onClick={() => setResumeData(prev => ({ ...prev, skills: [...new Set([...prev.skills, "UI/UX Design", "Figma", "Adobe XD", "Wireframing", "Prototyping"])] }))} size="sm" variant="outline">+ UI/UX Design</Button>
                      <Button onClick={() => setResumeData(prev => ({ ...prev, skills: [...new Set([...prev.skills, "Python", "TensorFlow", "PyTorch", "Data Analysis", "Machine Learning"])] }))} size="sm" variant="outline">+ Data Science</Button>
                      <Button onClick={() => setResumeData(prev => ({ ...prev, skills: [...new Set([...prev.skills, "Project Management", "Agile", "Scrum", "JIRA", "Team Leadership"])] }))} size="sm" variant="outline">+ Project Management</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Work Experience */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Work Experience</h3>
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
                            <div className="flex items-center gap-2 pt-1">
                              <Checkbox 
                                id={`current-job-${exp.id}`} 
                                checked={exp.endDate === 'Present'}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleExperienceChange(exp.id, 'endDate', 'Present');
                                  } else {
                                    handleExperienceChange(exp.id, 'endDate', '');
                                  }
                                }}
                              />
                              <label htmlFor={`current-job-${exp.id}`} className="text-sm">Current Position</label>
                            </div>
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
                          <div className="text-sm text-muted-foreground">
                            Pro tip: Use the STAR method (Situation, Task, Action, Result) to describe your achievements.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Top Indian Companies</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Button onClick={() => { 
                        const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
                        setResumeData(prev => ({
                          ...prev,
                          experiences: [
                            ...prev.experiences, 
                            { id: newId, company: "Tata Consultancy Services", position: "", startDate: "", endDate: "", description: "" }
                          ]
                        }));
                      }} size="sm" variant="outline" className="justify-start">+ Tata Consultancy Services</Button>
                      <Button onClick={() => { 
                        const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
                        setResumeData(prev => ({
                          ...prev,
                          experiences: [
                            ...prev.experiences, 
                            { id: newId, company: "Infosys", position: "", startDate: "", endDate: "", description: "" }
                          ]
                        }));
                      }} size="sm" variant="outline" className="justify-start">+ Infosys</Button>
                      <Button onClick={() => { 
                        const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
                        setResumeData(prev => ({
                          ...prev,
                          experiences: [
                            ...prev.experiences, 
                            { id: newId, company: "Wipro", position: "", startDate: "", endDate: "", description: "" }
                          ]
                        }));
                      }} size="sm" variant="outline" className="justify-start">+ Wipro</Button>
                      <Button onClick={() => { 
                        const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
                        setResumeData(prev => ({
                          ...prev,
                          experiences: [
                            ...prev.experiences, 
                            { id: newId, company: "HCL Technologies", position: "", startDate: "", endDate: "", description: "" }
                          ]
                        }));
                      }} size="sm" variant="outline" className="justify-start">+ HCL Technologies</Button>
                      <Button onClick={() => { 
                        const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
                        setResumeData(prev => ({
                          ...prev,
                          experiences: [
                            ...prev.experiences, 
                            { id: newId, company: "Tech Mahindra", position: "", startDate: "", endDate: "", description: "" }
                          ]
                        }));
                      }} size="sm" variant="outline" className="justify-start">+ Tech Mahindra</Button>
                      <Button onClick={() => { 
                        const newId = Math.max(0, ...resumeData.experiences.map(e => e.id)) + 1;
                        setResumeData(prev => ({
                          ...prev,
                          experiences: [
                            ...prev.experiences, 
                            { id: newId, company: "Reliance Industries", position: "", startDate: "", endDate: "", description: "" }
                          ]
                        }));
                      }} size="sm" variant="outline" className="justify-start">+ Reliance Industries</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Education */}
              {activeTab === "education" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Education</h3>
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
