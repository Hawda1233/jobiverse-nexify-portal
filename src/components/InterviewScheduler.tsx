
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

// Interface representing a job option for selection
interface JobOption {
  id: string;
  title: string;
}

// Define the interview data structure
export interface InterviewData {
  jobTitle: string;
  date: Date;
  time: string;
  jobId: string;
  duration: string;
  candidateName: string;
  candidateEmail: string;
  interviewType: string;
  notes: string;
}

// Props for the InterviewScheduler component
interface InterviewSchedulerProps {
  onSchedule: (data: InterviewData) => void;
  onCancel: () => void;
  jobOptions: JobOption[];
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ onSchedule, onCancel, jobOptions }) => {
  const [selectedJob, setSelectedJob] = useState<JobOption | null>(null);
  const [interviewDate, setInterviewDate] = useState<Date>(new Date());
  const [interviewTime, setInterviewTime] = useState("09:00");
  const [interviewDuration, setInterviewDuration] = useState("30");
  const [interviewType, setInterviewType] = useState("technical");
  const [interviewNotes, setInterviewNotes] = useState("");
  const { userData } = useAuth();

  const handleSchedule = () => {
    if (!selectedJob) {
      alert("Please select a job position");
      return;
    }

    const newInterview = {
      jobTitle: selectedJob.title || "Untitled Position",
      date: new Date(interviewDate),
      time: interviewTime,
      jobId: selectedJob.id || "",
      duration: interviewDuration,
      candidateName: userData?.displayName || "Unknown",
      candidateEmail: userData?.email || "",
      interviewType: interviewType,
      notes: interviewNotes
    };

    onSchedule(newInterview);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="job-position">Job Position</Label>
          <Select onValueChange={(value) => {
            const selected = jobOptions.find(job => job.id === value);
            setSelectedJob(selected || null);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select job position" />
            </SelectTrigger>
            <SelectContent>
              {jobOptions.map(job => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Interview Date</Label>
          <Card className="mt-2">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={interviewDate}
                onSelect={(date) => date && setInterviewDate(date)}
                initialFocus
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="interview-time">Interview Time</Label>
            <Input
              id="interview-time"
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="interview-duration">Duration (minutes)</Label>
            <Select value={interviewDuration} onValueChange={setInterviewDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="interview-type">Interview Type</Label>
          <Select value={interviewType} onValueChange={setInterviewType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="case">Case Study</SelectItem>
              <SelectItem value="screening">Initial Screening</SelectItem>
              <SelectItem value="final">Final Round</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="interview-notes">Notes</Label>
          <Textarea
            id="interview-notes"
            placeholder="Add any preparation notes or questions for the candidate..."
            value={interviewNotes}
            onChange={(e) => setInterviewNotes(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSchedule}>
          Schedule Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewScheduler;
