
import React from 'react';
import { Award, Sparkles, Check, ThumbsUp, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="mt-4 pt-2 border-t">
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
            <Badge variant="outline" className="mb-1">Model Answer</Badge>
            
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm">
                {paragraph}
              </p>
            ))}
            
            <div className="mt-4 pt-3 border-t border-dashed border-primary/20 flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3 mr-1" />
                <span>Powered by OpenAI GPT</span>
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
            Using this answer as inspiration can help you improve your interview skills
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedAnswerSection;
