
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { BrainCog } from "lucide-react";

interface AIInterviewerAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

const AIInterviewerAvatar: React.FC<AIInterviewerAvatarProps> = ({
  isSpeaking,
  isListening,
}) => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={isSpeaking ? "speaking" : isListening ? "listening" : "idle"}
        variants={{
          idle: {
            scale: 1,
            boxShadow: "0 0 0 rgba(66, 153, 225, 0)",
          },
          speaking: {
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0 rgba(66, 153, 225, 0)",
              "0 0 20px rgba(66, 153, 225, 0.7)",
              "0 0 0 rgba(66, 153, 225, 0)",
            ],
            transition: {
              repeat: Infinity,
              duration: 1.5,
            },
          },
          listening: {
            scale: [1, 1.03, 1],
            boxShadow: [
              "0 0 0 rgba(239, 68, 68, 0)",
              "0 0 20px rgba(239, 68, 68, 0.7)",
              "0 0 0 rgba(239, 68, 68, 0)",
            ],
            transition: {
              repeat: Infinity,
              duration: 1.2,
            },
          },
        }}
        className="mb-2"
      >
        <Avatar className={`h-24 w-24 ${isSpeaking ? "border-2 border-blue-400" : isListening ? "border-2 border-red-400" : ""}`}>
          <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150" />
          <AvatarFallback className="bg-primary/10">
            <BrainCog className="h-12 w-12 text-primary" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
      <div className="text-center">
        <h3 className="font-medium">AI Interviewer</h3>
        <p className="text-xs text-muted-foreground">
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Waiting..."}
        </p>
      </div>
    </div>
  );
};

export default AIInterviewerAvatar;
