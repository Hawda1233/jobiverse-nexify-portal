
import React, { useState } from "react";
import { InterviewProvider } from "@/contexts/InterviewContext";
import VirtualInterviewer from "@/components/VirtualInterviewer";
import InterviewSetup from "@/components/InterviewSetup";
import Navbar from "@/components/Navbar";

const InterviewSimulator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleResetInterview = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">AI Interview Simulator</h1>
          <p className="text-muted-foreground">
            Practice your interview skills with our AI-powered interviewer
          </p>
        </div>
        
        <InterviewProvider>
          {!selectedTopic ? (
            <InterviewSetup onTopicSelected={setSelectedTopic} />
          ) : (
            <VirtualInterviewer 
              topic={selectedTopic} 
              onReset={handleResetInterview}
            />
          )}
        </InterviewProvider>
      </main>
    </div>
  );
};

export default InterviewSimulator;
