
import React, { useState } from "react";
import { InterviewProvider } from "@/contexts/InterviewContext";
import VirtualInterviewer from "@/components/VirtualInterviewer";
import InterviewSetup from "@/components/InterviewSetup";
import Navbar from "@/components/Navbar";
import { Progress } from "@/components/ui/progress";

const InterviewSimulator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <InterviewProvider>
          {!selectedTopic ? (
            <InterviewSetup onTopicSelected={setSelectedTopic} />
          ) : (
            <VirtualInterviewer topic={selectedTopic} />
          )}
        </InterviewProvider>
      </main>
    </div>
  );
};

export default InterviewSimulator;
