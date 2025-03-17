
import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Save,
  Star 
} from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Skill {
  id: number;
  name: string;
  level: number; // 1-5
  category: string;
}

interface SkillsFormProps {
  skills: Skill[];
  onSave: (skills: Skill[]) => void;
}

const skillCategories = [
  "Technical",
  "Soft Skills",
  "Languages",
  "Tools",
  "Frameworks",
  "Other"
];

const SkillsForm: React.FC<SkillsFormProps> = ({ skills: initialSkills, onSave }) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState(skillCategories[0]);
  const [newLevel, setNewLevel] = useState(3);
  const [isOpen, setIsOpen] = useState(true);

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    
    const newId = skills.length > 0 
      ? Math.max(...skills.map(skill => skill.id)) + 1 
      : 1;
    
    setSkills([
      ...skills,
      {
        id: newId,
        name: newSkill.trim(),
        level: newLevel,
        category: newCategory
      }
    ]);
    
    setNewSkill("");
    setNewLevel(3);
  };

  const handleRemoveSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleSave = () => {
    onSave(skills);
  };

  const getSkillsByCategory = () => {
    const grouped: Record<string, Skill[]> = {};
    
    skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    
    return grouped;
  };
  
  const groupedSkills = getSkillsByCategory();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Skills Manager
          </span>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </CardTitle>
      </CardHeader>
      
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <Label htmlFor="skillName">Skill Name</Label>
                  <Input 
                    id="skillName"
                    placeholder="e.g., JavaScript, Project Management"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                </div>
                
                <div className="md:col-span-3">
                  <Label htmlFor="skillCategory">Category</Label>
                  <select 
                    id="skillCategory"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  <Label htmlFor="skillLevel">Proficiency (1-5)</Label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range"
                      id="skillLevel"
                      min="1"
                      max="5"
                      value={newLevel}
                      onChange={(e) => setNewLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium w-5">{newLevel}</span>
                  </div>
                </div>
                
                <div className="md:col-span-1 flex items-end">
                  <Button 
                    onClick={handleAddSkill} 
                    size="icon"
                    className="w-full h-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Your Skills</h3>
                {Object.keys(groupedSkills).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No skills added yet. Start adding your professional skills above.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase">{category}</h4>
                        <div className="space-y-2">
                          {categorySkills.map(skill => (
                            <div key={skill.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-sm">{skill.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs text-muted-foreground"
                                >
                                  Level {skill.level}
                                </Badge>
                              </div>
                              <div className="flex-1 mx-2">
                                <Progress value={skill.level * 20} className="h-2" />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleRemoveSkill(skill.id)}
                                className="h-7 w-7"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button onClick={handleSave} className="ml-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Skills
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SkillsForm;
