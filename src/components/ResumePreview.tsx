
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";

interface ResumePreviewProps {
  resumeData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    objective: string;
    skills: string[];
    experiences: {
      id: number;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    education: {
      id: number;
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
    }[];
    certifications?: {
      id: number;
      name: string;
      issuer: string;
      date: string;
      expiry: string;
    }[];
    projects?: {
      id: number;
      title: string;
      description: string;
      link: string;
    }[];
    languages?: {
      id: number;
      name: string;
      proficiency: string;
    }[];
    references?: {
      id: number;
      name: string;
      position: string;
      company: string;
      email: string;
      phone: string;
    }[];
    achievements?: string;
    hobbies?: string;
  };
  theme?: string;
  font?: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, theme = "modern", font = "Inter" }) => {
  // Format the date string (from YYYY-MM to MMM YYYY)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr === "Present") return "Present";
    
    try {
      const [year, month] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return dateStr;
    }
  };

  // Determine theme-specific classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'classic':
        return {
          container: 'bg-white border-0',
          header: 'text-center border-b-2 border-gray-800 pb-4 mb-6',
          name: 'text-2xl font-serif text-gray-900',
          section: 'mb-6',
          sectionTitle: 'text-lg font-serif border-b border-gray-300 pb-1 mb-3 text-gray-800',
          contactInfo: 'flex justify-center flex-wrap gap-x-4 text-sm text-gray-600',
        };
      case 'minimal':
        return {
          container: 'bg-gray-50 border-0 shadow-none',
          header: 'mb-6',
          name: 'text-2xl font-light tracking-wide',
          section: 'mb-6',
          sectionTitle: 'text-sm uppercase tracking-wider font-medium text-gray-500 mb-3',
          contactInfo: 'flex flex-wrap gap-x-4 text-sm text-gray-500 mt-2',
        };
      case 'professional':
        return {
          container: 'bg-white border-0',
          header: 'border-b-4 border-indigo-600 pb-4 mb-6',
          name: 'text-2xl font-bold text-indigo-900',
          section: 'mb-6',
          sectionTitle: 'text-lg font-bold text-indigo-800 mb-3',
          contactInfo: 'flex flex-wrap gap-x-4 text-sm text-gray-600 mt-2',
        };
      case 'creative':
        return {
          container: 'bg-gradient-to-tr from-pink-50 to-blue-50 border-0',
          header: 'mb-6',
          name: 'text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500',
          section: 'mb-6',
          sectionTitle: 'text-lg font-bold text-pink-600 mb-3',
          contactInfo: 'flex flex-wrap gap-x-4 text-sm bg-white bg-opacity-70 rounded-full px-4 py-2 mt-2 justify-center',
        };
      case 'modern':
      default:
        return {
          container: 'bg-white border-0',
          header: 'mb-6',
          name: 'text-2xl font-bold',
          section: 'mb-6',
          sectionTitle: 'text-lg font-semibold border-b pb-1 mb-3',
          contactInfo: 'flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-2',
        };
    }
  };

  const themeClasses = getThemeClasses();
  
  return (
    <Card className={`border shadow-md ${themeClasses.container}`}>
      <CardContent className="p-8" style={{ fontFamily: font }}>
        {/* Header */}
        <div className={themeClasses.header}>
          <h1 className={themeClasses.name}>{resumeData.name || "Your Name"}</h1>
          <div className={themeClasses.contactInfo}>
            {resumeData.email && <span>{resumeData.email}</span>}
            {resumeData.phone && <span>{resumeData.phone}</span>}
            {resumeData.location && <span>{resumeData.location}</span>}
          </div>
        </div>
        
        {/* Objective */}
        {resumeData.objective && (
          <>
            <div className={themeClasses.section}>
              <h2 className={themeClasses.sectionTitle}>Professional Summary</h2>
              <p className="text-sm">{resumeData.objective}</p>
            </div>
          </>
        )}
        
        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <>
            <div className={themeClasses.section}>
              <h2 className={themeClasses.sectionTitle}>Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-muted px-2.5 py-0.5 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Experience */}
        {resumeData.experiences.length > 0 && resumeData.experiences[0].company && (
          <>
            <div className={themeClasses.section}>
              <h2 className={themeClasses.sectionTitle}>Experience</h2>
              <div className="space-y-4">
                {resumeData.experiences.map((exp) => (
                  exp.company && (
                    <div key={exp.id} className="mb-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{exp.position}</h3>
                        <span className="text-sm text-muted-foreground">
                          {exp.startDate && formatDate(exp.startDate)} — 
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{exp.company}</div>
                      {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                    </div>
                  )
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Education */}
        {resumeData.education.length > 0 && resumeData.education[0].institution && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                edu.institution && (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <span className="text-sm text-muted-foreground">
                        {edu.startDate && formatDate(edu.startDate)} — 
                        {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{edu.institution}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>Certifications</h2>
            <div className="space-y-3">
              {resumeData.certifications.map((cert) => (
                cert.name && (
                  <div key={cert.id} className="mb-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{cert.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {cert.date && formatDate(cert.date)}
                        {cert.expiry && ` — ${formatDate(cert.expiry)}`}
                      </span>
                    </div>
                    {cert.issuer && <div className="text-sm text-muted-foreground">{cert.issuer}</div>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && resumeData.projects[0].title && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>Projects</h2>
            <div className="space-y-3">
              {resumeData.projects.map((proj) => (
                proj.title && (
                  <div key={proj.id} className="mb-2">
                    <h3 className="font-medium">{proj.title}</h3>
                    {proj.description && <p className="text-sm mt-1">{proj.description}</p>}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        Project Link
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {/* Languages */}
        {resumeData.languages && resumeData.languages.length > 0 && resumeData.languages[0].name && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>Languages</h2>
            <div className="flex flex-wrap gap-4">
              {resumeData.languages.map((lang) => (
                lang.name && (
                  <div key={lang.id} className="flex items-center gap-2">
                    <span className="font-medium">{lang.name}:</span>
                    <span className="text-sm text-muted-foreground">{lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {/* Achievements */}
        {resumeData.achievements && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>Achievements</h2>
            <div className="space-y-1">
              {resumeData.achievements.split('\n').filter(line => line.trim()).map((achievement, idx) => (
                <p key={idx} className="text-sm">• {achievement}</p>
              ))}
            </div>
          </div>
        )}
        
        {/* Hobbies */}
        {resumeData.hobbies && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>Hobbies & Interests</h2>
            <p className="text-sm">{resumeData.hobbies}</p>
          </div>
        )}
        
        {/* References */}
        {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].name && (
          <div className={themeClasses.section}>
            <h2 className={themeClasses.sectionTitle}>References</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumeData.references.map((ref) => (
                ref.name && (
                  <div key={ref.id} className="text-sm">
                    <p className="font-medium">{ref.name}</p>
                    {ref.position && <p>{ref.position}{ref.company && `, ${ref.company}`}</p>}
                    {ref.email && <p>{ref.email}</p>}
                    {ref.phone && <p>{ref.phone}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;
