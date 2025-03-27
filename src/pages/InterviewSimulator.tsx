
import React, { useState, useEffect } from "react";
import { InterviewProvider } from "@/contexts/InterviewContext";
import VirtualInterviewer from "@/components/VirtualInterviewer";
import InterviewSetup from "@/components/InterviewSetup";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Default API key for the application
const DEFAULT_API_KEY = "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";

const InterviewSimulator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium");
  const [storedApiKey, setStoredApiKey] = useState<string>(() => {
    // Always use the default API key
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', DEFAULT_API_KEY);
      return DEFAULT_API_KEY;
    }
    return DEFAULT_API_KEY;
  });

  // Set default API key on component mount
  useEffect(() => {
    localStorage.setItem('openai_api_key', DEFAULT_API_KEY);
    setStoredApiKey(DEFAULT_API_KEY);
  }, []);

  const handleResetInterview = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24 flex-grow">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-white">AI-Powered Interview Simulator</h1>
          <p className="text-gray-300 mb-4">
            Practice with our intelligent interviewer that adapts to your responses and provides real-time feedback
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
              Google AI Powered
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 hover:bg-green-500/20">
              Smart Interview Analysis
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
              Realistic Interview Experience
            </Badge>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="text-green-400 text-sm">✓ AI powered interview ready</span>
          </div>
        </div>
        
        <InterviewProvider apiKey={storedApiKey}>
          {!selectedTopic ? (
            <InterviewSetup 
              onTopicSelected={setSelectedTopic} 
              difficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
            />
          ) : (
            <VirtualInterviewer 
              topic={selectedTopic}
              difficulty={selectedDifficulty}
              onReset={handleResetInterview}
            />
          )}
        </InterviewProvider>
      </main>

      <Footer />
    </div>
  );
};

export default InterviewSimulator;
