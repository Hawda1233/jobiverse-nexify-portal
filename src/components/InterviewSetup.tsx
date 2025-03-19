
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInterview, AI_CHARACTERS } from "@/contexts/InterviewContext";
import { 
  Briefcase, 
  Brain, 
  Users, 
  Trophy,
  ArrowRight, 
  Shield,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface InterviewSetupProps {
  onTopicSelected: (topic: string) => void;
  difficulty?: string;
  onDifficultyChange?: (difficulty: string) => void;
}

const topics = [
  {
    id: "general",
    title: "General Interview",
    description: "Common questions asked in most job interviews",
    icon: <Briefcase className="h-8 w-8 text-blue-500" />,
  },
  {
    id: "technical",
    title: "Technical Interview",
    description: "Questions focusing on technical skills and problem-solving",
    icon: <Brain className="h-8 w-8 text-purple-500" />,
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    description: "Questions about past experiences and how you handled situations",
    icon: <Users className="h-8 w-8 text-green-500" />,
  },
  {
    id: "leadership",
    title: "Leadership Interview",
    description: "Questions focusing on leadership skills and experience",
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
  },
];

const difficultyLevels = [
  {
    id: "easy",
    title: "Easy",
    description: "Basic questions for entry-level positions",
    icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
  },
  {
    id: "medium",
    title: "Medium",
    description: "Moderate questions for mid-level positions",
    icon: <Shield className="h-5 w-5 text-amber-500" />,
  },
  {
    id: "hard",
    title: "Hard",
    description: "Challenging questions for senior positions",
    icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
  },
];

const InterviewSetup: React.FC<InterviewSetupProps> = ({ 
  onTopicSelected,
  difficulty = "medium",
  onDifficultyChange = () => {}
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<typeof AI_CHARACTERS[0]>(AI_CHARACTERS[0]);
  const { setInterviewCharacter } = useInterview();

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleStartInterview = () => {
    if (selectedTopic) {
      setInterviewCharacter(selectedCharacter);
      onTopicSelected(selectedTopic);
    }
  };

  const handleSelectCharacter = (characterId: string) => {
    const character = AI_CHARACTERS.find(c => c.id === characterId);
    if (character) {
      setSelectedCharacter(character);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 bg-background/95 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle>Select Interview Type</CardTitle>
          <CardDescription>
            Choose the type of interview you want to practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all
                  ${selectedTopic === topic.id 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : 'bg-card hover:bg-accent/50 border-2 border-transparent'
                  }
                `}
                onClick={() => handleSelectTopic(topic.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-background/95 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle>Interview Difficulty</CardTitle>
          <CardDescription>
            Select the difficulty level for your interview questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={difficulty} 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            onValueChange={onDifficultyChange}
          >
            {difficultyLevels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <RadioGroupItem value={level.id} id={`difficulty-${level.id}`} />
                <Label 
                  htmlFor={`difficulty-${level.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {level.icon}
                  <div>
                    <div className="font-medium">{level.title}</div>
                    <div className="text-xs text-muted-foreground">{level.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-background/95 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle>Select Interviewer</CardTitle>
          <CardDescription>
            Choose who will be conducting your interview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCharacter.id}
            onValueChange={handleSelectCharacter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an interviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Interviewers</SelectLabel>
                {AI_CHARACTERS.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{character.name}</div>
                      <div className="text-xs text-muted-foreground">({character.title})</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="mt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-muted">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={selectedCharacter.imageUrl}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{selectedCharacter.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{selectedCharacter.title}</p>
                <p className="text-sm">{selectedCharacter.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleStartInterview}
          disabled={!selectedTopic}
          className="px-6"
        >
          Start Interview <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InterviewSetup;
