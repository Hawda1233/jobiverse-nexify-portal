
import React, { useState, useEffect } from "react";
import { InterviewProvider } from "@/contexts/InterviewContext";
import VirtualInterviewer from "@/components/VirtualInterviewer";
import InterviewSetup from "@/components/InterviewSetup";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Default API key for the application
const DEFAULT_API_KEY = "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";

const InterviewSimulator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("medium");
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [storedApiKey, setStoredApiKey] = useState<string>(() => {
    // Try to get the API key from localStorage or use default
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_api_key') || DEFAULT_API_KEY;
    }
    return DEFAULT_API_KEY;
  });

  // Check for API key on component mount but don't show dialog automatically
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (!savedKey) {
      // We have a default key, so no need to show dialog automatically
      localStorage.setItem('openai_api_key', DEFAULT_API_KEY);
      setStoredApiKey(DEFAULT_API_KEY);
    }
  }, []);

  const handleResetInterview = () => {
    setSelectedTopic(null);
  };

  const handleSaveApiKey = () => {
    if (openAIKey.trim()) {
      // Check if key starts with "sk-" to validate it's an OpenAI key
      if (!openAIKey.startsWith("sk-")) {
        toast.error("Invalid API key format. OpenAI keys typically start with 'sk-'");
        return;
      }

      localStorage.setItem('openai_api_key', openAIKey);
      setStoredApiKey(openAIKey);
      setShowApiKeyDialog(false);
      toast.success("API Key has been saved successfully");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const handleClearApiKey = () => {
    localStorage.setItem('openai_api_key', DEFAULT_API_KEY);
    setStoredApiKey(DEFAULT_API_KEY);
    setOpenAIKey("");
    toast.success("Using default API key");
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
            {storedApiKey && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-green-400 text-sm">✓ AI powered interview ready</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowApiKeyDialog(true)}
                >
                  Custom API Key
                </Button>
                {storedApiKey !== DEFAULT_API_KEY && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleClearApiKey}
                  >
                    Use Default Key
                  </Button>
                )}
              </div>
            )}
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

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Custom OpenAI API Key (Optional)</DialogTitle>
            <DialogDescription>
              We provide Google AI and a built-in OpenAI API key, but you can use your own OpenAI key for enhanced performance. It will be stored only in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers. Get your API key from
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary ml-1 hover:underline"
                >
                  OpenAI Platform
                </a>.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default InterviewSimulator;
