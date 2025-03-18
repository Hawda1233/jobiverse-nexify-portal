
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useInterview, AI_CHARACTERS } from "@/contexts/InterviewContext";
import { motion } from "framer-motion";
import { CheckCircle2, Briefcase, Code, UserCheck, Users, GraduationCap, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InterviewSetupProps {
  onTopicSelected: (topic: string) => void;
}

interface InterviewCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onTopicSelected }) => {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [characterStep, setCharacterStep] = useState(false);
  const { setInterviewCharacter } = useInterview();
  const [selectedCharacter, setSelectedCharacter] = useState(AI_CHARACTERS[0]);
  const [selectedIndustry, setSelectedIndustry] = useState("tech");

  const generalCategories: InterviewCategory[] = [
    {
      id: "general",
      title: "General Interview",
      description: "Common questions asked in most interviews",
      icon: <Briefcase className="h-5 w-5 text-blue-500" />
    },
    {
      id: "technical",
      title: "Technical Interview",
      description: "Questions focusing on your technical skills and knowledge",
      icon: <Code className="h-5 w-5 text-green-500" />
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description: "Questions about past experiences and how you handled situations",
      icon: <UserCheck className="h-5 w-5 text-purple-500" />
    },
    {
      id: "leadership",
      title: "Leadership Interview",
      description: "Questions focused on leadership skills and experience",
      icon: <Users className="h-5 w-5 text-orange-500" />
    }
  ];

  const industrySpecificCategories: Record<string, InterviewCategory[]> = {
    tech: [
      {
        id: "software_engineering",
        title: "Software Engineering",
        description: "Technical coding questions, system design, and software principles",
        icon: <Code className="h-5 w-5 text-blue-500" />
      },
      {
        id: "product_management",
        title: "Product Management",
        description: "Product strategy, user experience, and roadmap planning questions",
        icon: <Briefcase className="h-5 w-5 text-purple-500" />
      },
      {
        id: "data_science",
        title: "Data Science",
        description: "Data analysis, machine learning, and statistical modeling questions",
        icon: <GraduationCap className="h-5 w-5 text-green-500" />
      }
    ],
    finance: [
      {
        id: "investment_banking",
        title: "Investment Banking",
        description: "Financial modeling, deal structures, and market analysis questions",
        icon: <Briefcase className="h-5 w-5 text-blue-500" />
      },
      {
        id: "financial_analyst",
        title: "Financial Analyst",
        description: "Financial reporting, valuation, and forecasting questions",
        icon: <Globe className="h-5 w-5 text-green-500" />
      }
    ],
    healthcare: [
      {
        id: "clinical",
        title: "Clinical Roles",
        description: "Patient care, medical knowledge, and clinical scenarios",
        icon: <UserCheck className="h-5 w-5 text-red-500" />
      },
      {
        id: "healthcare_admin",
        title: "Healthcare Administration",
        description: "Healthcare regulations, operations, and management",
        icon: <Briefcase className="h-5 w-5 text-blue-500" />
      }
    ]
  };

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

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    // Reset the selected category when changing industries
    setSelectedCategory(industrySpecificCategories[industry][0].id);
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
            <Tabs 
              defaultValue="general" 
              className="mb-6"
              onValueChange={(value) => {
                if (value === "industry") {
                  setSelectedCategory(industrySpecificCategories[selectedIndustry][0].id);
                } else {
                  setSelectedCategory(generalCategories[0].id);
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Categories</TabsTrigger>
                <TabsTrigger value="industry">Industry Specific</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-4">
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={handleCategorySelect}
                  className="space-y-4"
                >
                  {generalCategories.map((category) => (
                    <div 
                      key={category.id}
                      className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={category.id} id={category.id} />
                      <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          {category.icon}
                          {category.title}
                        </div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
              <TabsContent value="industry" className="mt-4">
                <div className="mb-4">
                  <Label className="mb-2 block">Select Industry</Label>
                  <RadioGroup
                    value={selectedIndustry}
                    onValueChange={handleIndustryChange}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="rounded-md border flex justify-center p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="tech" id="tech" className="sr-only" />
                      <Label htmlFor="tech" className="cursor-pointer flex flex-col items-center gap-2">
                        <Code className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">Tech</span>
                      </Label>
                    </div>
                    <div className="rounded-md border flex justify-center p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="finance" id="finance" className="sr-only" />
                      <Label htmlFor="finance" className="cursor-pointer flex flex-col items-center gap-2">
                        <Globe className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Finance</span>
                      </Label>
                    </div>
                    <div className="rounded-md border flex justify-center p-3 cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="healthcare" id="healthcare" className="sr-only" />
                      <Label htmlFor="healthcare" className="cursor-pointer flex flex-col items-center gap-2">
                        <UserCheck className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">Healthcare</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={handleCategorySelect}
                  className="space-y-4"
                >
                  {industrySpecificCategories[selectedIndustry].map((category) => (
                    <div 
                      key={category.id}
                      className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <RadioGroupItem value={category.id} id={category.id} />
                      <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          {category.icon}
                          {category.title}
                        </div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 mt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Interview Difficulty</h3>
              <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-2">
                <div className="border rounded-md text-center p-2 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="easy" id="easy" className="sr-only" />
                  <Label htmlFor="easy" className="cursor-pointer text-sm">Easy</Label>
                </div>
                <div className="border rounded-md text-center p-2 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="medium" id="medium" className="sr-only" />
                  <Label htmlFor="medium" className="cursor-pointer text-sm">Medium</Label>
                </div>
                <div className="border rounded-md text-center p-2 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="hard" id="hard" className="sr-only" />
                  <Label htmlFor="hard" className="cursor-pointer text-sm">Hard</Label>
                </div>
              </RadioGroup>
            </div>
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
