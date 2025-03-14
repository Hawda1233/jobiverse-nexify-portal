
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInterview } from "@/contexts/InterviewContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Mic, Settings } from "lucide-react";

interface InterviewSetupProps {
  onTopicSelected: (topic: string) => void;
}

const InterviewCategories = [
  {
    id: "general",
    title: "General Interview",
    description: "Common questions asked in most job interviews.",
  },
  {
    id: "technical",
    title: "Technical Interview",
    description: "Questions focused on technical skills and problem-solving.",
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    description: "Questions about past experiences and how you handled situations.",
  },
  {
    id: "leadership",
    title: "Leadership Interview",
    description: "Questions focused on leadership skills and experience.",
  },
];

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onTopicSelected }) => {
  const { resetInterview, setCustomQuestions } = useInterview();
  const [activeTab, setActiveTab] = useState("presets");
  const [customTitle, setCustomTitle] = useState("");
  const [customQuestions, setCustomQuestionsLocal] = useState("");
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  
  const handleTopicSelection = (topicId: string) => {
    onTopicSelected(topicId);
  };

  const handleCustomInterview = () => {
    if (customTitle && customQuestions) {
      const questions = customQuestions.split('\n').filter(q => q.trim().length > 0);
      if (questions.length > 0) {
        setCustomQuestions(questions);
        onTopicSelected(customTitle);
      }
    }
  };

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
    } catch (error) {
      setMicPermission(false);
      console.error("Microphone permission denied:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Interview Simulator Setup</CardTitle>
        <CardDescription>
          Prepare for your next interview with our AI-powered interview simulator.
          Choose a preset interview type or create your own custom interview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted">
          <div className={`p-3 rounded-full ${micPermission === true ? 'bg-green-100 text-green-600' : micPermission === false ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            <Mic className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Microphone Access</h3>
            <p className="text-sm text-muted-foreground">
              {micPermission === null 
                ? "The interview simulator works best with voice input. Click to check microphone access." 
                : micPermission 
                  ? "Microphone access granted. You're all set for voice interaction!" 
                  : "Microphone access denied. You'll need to enable it in your browser settings for voice features."}
            </p>
          </div>
          {micPermission !== true && (
            <Button variant="outline" onClick={checkMicrophonePermission}>
              Check Access
            </Button>
          )}
          {micPermission === true && (
            <Check className="h-6 w-6 text-green-600" />
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Interviews</TabsTrigger>
            <TabsTrigger value="custom">Custom Interview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {InterviewCategories.map((category) => (
                <Card key={category.id} className="hover:border-primary cursor-pointer transition-all" onClick={() => handleTopicSelection(category.id)}>
                  <CardHeader className="pb-2">
                    <CardTitle>{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Interview Title</Label>
                <Input 
                  id="title" 
                  placeholder="E.g., Product Manager Interview" 
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="questions">
                  Questions (one per line)
                </Label>
                <Textarea 
                  id="questions" 
                  placeholder="Enter your interview questions, one per line.
E.g., Tell me about your experience with product development.
How do you prioritize features?
How do you handle stakeholder disagreements?"
                  className="min-h-[200px]"
                  value={customQuestions}
                  onChange={(e) => setCustomQuestionsLocal(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCustomInterview}
                disabled={!customTitle || !customQuestions}
              >
                Start Custom Interview
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>Features: AI evaluation, voice recognition, and progress tracking.</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InterviewSetup;
