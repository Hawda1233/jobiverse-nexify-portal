
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
  };
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{resumeData.name || "Your Name"}</h1>
            <div className="flex justify-center flex-wrap gap-x-4 text-sm text-muted-foreground mt-2">
              {resumeData.email && <span>{resumeData.email}</span>}
              {resumeData.phone && <span>{resumeData.phone}</span>}
              {resumeData.location && <span>{resumeData.location}</span>}
            </div>
          </div>
          
          {/* Objective */}
          {resumeData.objective && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
                <p className="text-sm">{resumeData.objective}</p>
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
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
              <Separator className="my-4" />
            </>
          )}
          
          {/* Experience */}
          {resumeData.experiences.length > 0 && resumeData.experiences[0].company && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
                <div className="space-y-4">
                  {resumeData.experiences.map((exp) => (
                    exp.company && (
                      <div key={exp.id} className="mb-3">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{exp.position}</h3>
                          <span className="text-sm text-muted-foreground">
                            {exp.startDate && exp.startDate.substring(0, 7)} — 
                            {exp.endDate ? exp.endDate.substring(0, 7) : "Present"}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">{exp.company}</div>
                        {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                      </div>
                    )
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          {/* Education */}
          {resumeData.education.length > 0 && resumeData.education[0].institution && (
            <div>
              <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
              <div className="space-y-4">
                {resumeData.education.map((edu) => (
                  edu.institution && (
                    <div key={edu.id} className="mb-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                        <span className="text-sm text-muted-foreground">
                          {edu.startDate && edu.startDate.substring(0, 7)} — 
                          {edu.endDate ? edu.endDate.substring(0, 7) : "Present"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{edu.institution}</div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumePreview;
