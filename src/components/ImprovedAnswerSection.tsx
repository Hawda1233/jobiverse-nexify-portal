
import React from 'react';
import { Award, Sparkles, Check, ThumbsUp, BookOpen, Copy, Check as CheckIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedAnswer);
    setCopied(true);
    toast.success("Answer copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center text-primary">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" /> 
            AI-Enhanced Answer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-background/60 p-3 rounded-md mb-3">
            <Badge variant="outline" className="mb-1">Question</Badge>
            <p className="text-sm font-medium">{question}</p>
          </div>

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
            
            <div className="mt-4 pt-3 border-t border-dashed border-primary/20 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>Powered by OpenAI</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                  <Check className="h-3 w-3 mr-1" />
                  Add to Notes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
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
