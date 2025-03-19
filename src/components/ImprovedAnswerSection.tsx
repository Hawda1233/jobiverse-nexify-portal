
import React, { useState } from 'react';
import { Award, Sparkles, Check, ThumbsUp, ThumbsDown, BookOpen, Copy, Check as CheckIcon, Download, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImprovedAnswerSectionProps {
  improvedAnswer: string;
  question: string;
}

const ImprovedAnswerSection: React.FC<ImprovedAnswerSectionProps> = ({ 
  improvedAnswer, 
  question 
}) => {
  // Split by paragraphs for better readability
  const paragraphs = improvedAnswer.split('\n\n').filter(p => p.trim().length > 0);
  
  const [copied, setCopied] = useState(false);
  const [helpfulMarked, setHelpfulMarked] = useState(false);
  const [unhelpfulMarked, setUnhelpfulMarked] = useState(false);
  const [savedToNotes, setSavedToNotes] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedAnswer);
    setCopied(true);
    toast.success("Answer copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveToNotes = () => {
    // Get existing notes from localStorage
    const savedNotes = localStorage.getItem('interview_notes') || '[]';
    const notesArray = JSON.parse(savedNotes);
    
    // Add this answer to notes
    notesArray.push({
      question,
      answer: improvedAnswer,
      timestamp: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem('interview_notes', JSON.stringify(notesArray));
    
    setSavedToNotes(true);
    toast.success("Added to your interview notes");
  };

  const markHelpful = () => {
    setHelpfulMarked(true);
    setUnhelpfulMarked(false);
    toast.success("Feedback recorded. Thank you!");
  };

  const markUnhelpful = () => {
    setUnhelpfulMarked(true);
    setHelpfulMarked(false);
    toast("Thank you for your feedback");
  };

  const downloadAnswer = () => {
    const element = document.createElement("a");
    const file = new Blob([`Question: ${question}\n\nAnswer: ${improvedAnswer}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "interview-answer.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Answer downloaded");
  };

  // Create key points from the improved answer
  const keyPoints = paragraphs.map(p => {
    // Extract the first sentence or first 100 chars if too long
    const firstSentence = p.split('.')[0] + '.';
    return firstSentence.length < 100 ? firstSentence : p.substring(0, 100) + '...';
  }).filter((p, i) => i < 3); // Limit to 3 key points

  return (
    <div className="mt-6 pt-4 border-t">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center text-primary">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" /> 
            AI-Enhanced Answer
          </CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="full">Full Answer</TabsTrigger>
              <TabsTrigger value="key-points">Key Points</TabsTrigger>
              <TabsTrigger value="practice">Practice Mode</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-2">
            <div className="bg-background/60 p-3 rounded-md mb-3">
              <Badge variant="outline" className="mb-1">Question</Badge>
              <p className="text-sm font-medium">{question}</p>
            </div>
            
            <TabsContent value="full" className="m-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="mb-1">Model Answer</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <><CheckIcon className="h-3 w-3 mr-1 text-green-500" /> Copied</>
                    ) : (
                      <><Copy className="h-3 w-3 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
                
                <div className="bg-background/40 p-3 rounded-md">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-sm mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="key-points" className="m-0">
              <div className="space-y-3">
                <Badge variant="outline" className="mb-1">Key Answer Points</Badge>
                
                <div className="bg-background/40 p-3 rounded-md">
                  <ul className="space-y-2">
                    {keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-3 pt-3 border-t border-dashed border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      These key points highlight the most important aspects of the model answer.
                      Include these in your response for a strong impression.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="practice" className="m-0">
              <div className="space-y-3">
                <Badge variant="outline" className="mb-1">Practice Tips</Badge>
                
                <div className="bg-background/40 p-3 rounded-md">
                  <p className="text-sm mb-3">
                    To effectively practice this answer:
                  </p>
                  
                  <ol className="space-y-2 pl-5 list-decimal text-sm">
                    <li>Read the full answer 2-3 times to understand the structure</li>
                    <li>Practice saying it out loud without looking at the text</li>
                    <li>Record yourself and compare to the model answer</li>
                    <li>Focus on natural delivery rather than memorizing word-for-word</li>
                    <li>Customize with your own personal examples where relevant</li>
                  </ol>
                  
                  <div className="mt-3 pt-3 border-t border-dashed border-primary/20">
                    <p className="text-sm text-muted-foreground italic">
                      "Don't just memorize answers - understand the underlying structure and reasoning."
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <div className="mt-4 pt-3 border-t border-dashed border-primary/20 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>Powered by Google AI</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={helpfulMarked ? "default" : "ghost"} 
                  size="sm" 
                  className="text-xs h-7 px-2"
                  onClick={markHelpful}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful
                </Button>
                
                <Button 
                  variant={unhelpfulMarked ? "default" : "ghost"} 
                  size="sm" 
                  className="text-xs h-7 px-2"
                  onClick={markUnhelpful}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  Not Helpful
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pb-3 px-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={downloadAnswer}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            
            <Button 
              variant={savedToNotes ? "default" : "outline"} 
              size="sm" 
              className="text-xs"
              onClick={saveToNotes}
              disabled={savedToNotes}
            >
              <Check className="h-3 w-3 mr-1" />
              {savedToNotes ? "Saved to Notes" : "Save to Notes"}
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
      
      <div className="flex items-center justify-center mt-4">
        <div className="text-xs text-muted-foreground flex items-center">
          <Award className="h-3 w-3 mr-1 text-yellow-500" />
          <span>
            Use this model answer to improve your interview skills and practice delivery
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedAnswerSection;
