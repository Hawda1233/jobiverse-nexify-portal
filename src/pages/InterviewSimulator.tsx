
import React, { useState } from "react";
import { InterviewProvider } from "@/contexts/InterviewContext";
import VirtualInterviewer from "@/components/VirtualInterviewer";
import InterviewSetup from "@/components/InterviewSetup";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const InterviewSimulator: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState<boolean>(false);
  const [storedApiKey, setStoredApiKey] = useState<string>(() => {
    // Try to get the API key from localStorage on component mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_api_key') || "";
    }
    return "";
  });
  const { toast } = useToast();

  const handleResetInterview = () => {
    setSelectedTopic(null);
  };

  const handleSaveApiKey = () => {
    if (openAIKey.trim()) {
      localStorage.setItem('openai_api_key', openAIKey);
      setStoredApiKey(openAIKey);
      setShowApiKeyDialog(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved for this session.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setStoredApiKey("");
    setOpenAIKey("");
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-white">AI-Powered Interview Simulator</h1>
          <p className="text-gray-300 mb-4">
            Practice with our intelligent interviewer that adapts to your responses and provides real-time feedback
          </p>
          
          <div className="flex justify-center gap-2 mb-4">
            {storedApiKey ? (
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-sm">✓ OpenAI API Key configured</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowApiKeyDialog(true)}
                >
                  Change Key
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearApiKey}
                >
                  Clear Key
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowApiKeyDialog(true)}
                variant="outline"
              >
                Set OpenAI API Key
              </Button>
            )}
          </div>
        </div>
        
        <InterviewProvider apiKey={storedApiKey}>
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

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter OpenAI API Key</DialogTitle>
            <DialogDescription>
              This key is required for enhanced AI feedback. It will be stored only in your browser for this session.
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
                Your API key is stored locally and never sent to our servers.
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
    </div>
  );
};

export default InterviewSimulator;
