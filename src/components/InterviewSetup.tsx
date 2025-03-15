
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useInterview, AI_CHARACTERS } from "@/contexts/InterviewContext";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface InterviewSetupProps {
  onTopicSelected: (topic: string) => void;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onTopicSelected }) => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [characterStep, setCharacterStep] = useState(false);
  const { setInterviewCharacter } = useInterview();
  const [selectedCharacter, setSelectedCharacter] = useState(AI_CHARACTERS[0]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleNextStep = () => {
    setCharacterStep(true);
  };

  const handlePreviousStep = () => {
    setCharacterStep(false);
  };

  const handleStartInterview = () => {
    setInterviewCharacter(selectedCharacter);
    onTopicSelected(selectedCategory);
  };

  const handleCharacterSelect = (characterId: string) => {
    const character = AI_CHARACTERS.find(char => char.id === characterId) || AI_CHARACTERS[0];
    setSelectedCharacter(character);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Set Up Your Interview</CardTitle>
        <CardDescription>
          {characterStep 
            ? "Choose who will interview you" 
            : "Select the type of interview you want to practice"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!characterStep ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <RadioGroup
              defaultValue="general"
              value={selectedCategory}
              onValueChange={handleCategorySelect}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general" className="flex-1 cursor-pointer">
                  <div className="font-medium">General Interview</div>
                  <div className="text-sm text-muted-foreground">Common questions asked in most interviews</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="technical" id="technical" />
                <Label htmlFor="technical" className="flex-1 cursor-pointer">
                  <div className="font-medium">Technical Interview</div>
                  <div className="text-sm text-muted-foreground">Questions focusing on your technical skills and knowledge</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="behavioral" id="behavioral" />
                <Label htmlFor="behavioral" className="flex-1 cursor-pointer">
                  <div className="font-medium">Behavioral Interview</div>
                  <div className="text-sm text-muted-foreground">Questions about past experiences and how you handled situations</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <RadioGroupItem value="leadership" id="leadership" />
                <Label htmlFor="leadership" className="flex-1 cursor-pointer">
                  <div className="font-medium">Leadership Interview</div>
                  <div className="text-sm text-muted-foreground">Questions focused on leadership skills and experience</div>
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <RadioGroup
              value={selectedCharacter.id}
              onValueChange={handleCharacterSelect}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {AI_CHARACTERS.map((character) => (
                <div 
                  key={character.id}
                  className={`relative border rounded-lg p-4 transition-all ${
                    selectedCharacter.id === character.id 
                      ? "ring-2 ring-primary border-primary" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem
                    value={character.id}
                    id={character.id}
                    className="sr-only"
                  />
                  <Label 
                    htmlFor={character.id}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="relative mb-3">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      {selectedCharacter.id === character.id && (
                        <div className="absolute -right-1 -bottom-1 bg-primary rounded-full p-1">
                          <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-lg">{character.name}</div>
                      <div className="text-sm font-medium text-primary">{character.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{character.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {characterStep ? (
          <>
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
            <Button onClick={handleStartInterview}>
              Start Interview
            </Button>
          </>
        ) : (
          <Button onClick={handleNextStep} className="ml-auto">
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default InterviewSetup;
