
import React from "react";
import { InterviewProvider } from "@/contexts/InterviewContext";
import VirtualInterviewer from "@/components/VirtualInterviewer";
import Navbar from "@/components/Navbar";

const InterviewSimulator: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <InterviewProvider>
          <VirtualInterviewer />
        </InterviewProvider>
      </main>
    </div>
  );
};

export default InterviewSimulator;
