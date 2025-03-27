
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { BrainCog, Video, MicOff, Mic } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";

interface AIInterviewerAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  use3D?: boolean;
}

const AIInterviewerAvatar: React.FC<AIInterviewerAvatarProps> = ({
  isSpeaking,
  isListening
}) => {
  const { interviewState } = useInterview();
  const { selectedCharacter } = interviewState;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
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
          className="video-frame"
        >
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 aspect-video w-full max-w-[280px] md:max-w-[320px] shadow-xl border border-gray-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-32 w-32 md:h-40 md:w-40">
                <AvatarImage src={selectedCharacter.imageUrl} className="object-cover" />
                <AvatarFallback className="bg-primary/10">
                  <BrainCog className="h-12 w-12 text-primary" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Video call indicators */}
            <div className="absolute top-2 right-2 bg-red-500 rounded-full h-3 w-3 animate-pulse"></div>
            <div className="absolute bottom-3 left-3 flex space-x-2">
              <div className="bg-black/50 p-1.5 rounded-full">
                <Video className="h-4 w-4 text-white" />
              </div>
              <div className="bg-black/50 p-1.5 rounded-full">
                {isSpeaking ? (
                  <Mic className="h-4 w-4 text-white" />
                ) : (
                  <MicOff className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
            
            {/* Connection quality indicator */}
            <div className="absolute bottom-3 right-3 flex space-x-0.5">
              {[1, 2, 3, 4].map((bar) => (
                <div 
                  key={bar} 
                  className={`h-${bar} w-1 rounded-sm ${bar <= 3 ? "bg-green-500" : "bg-gray-600"}`}
                  style={{ height: `${bar * 3}px` }}
                ></div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Status indicator */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Waiting..."}
        </div>
      </div>
      
      <div className="text-center mt-6">
        <h3 className="font-medium text-white">{selectedCharacter.name}</h3>
        <p className="text-xs text-gray-400 mb-1">
          {selectedCharacter.title}
        </p>
      </div>
    </div>
  );
};

export default AIInterviewerAvatar;
