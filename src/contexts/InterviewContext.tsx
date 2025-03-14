
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

// Sample interview questions by category
const INTERVIEW_QUESTIONS = {
  general: [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want to work for this company?",
    "Describe a challenging situation at work and how you handled it.",
    "Where do you see yourself in 5 years?",
    "What experience do you have in this field?",
    "How do you handle stress and pressure?",
    "Describe your work ethic.",
  ],
  technical: [
    "Explain a complex technical concept you know well in simple terms.",
    "How do you stay updated with the latest developments in your field?",
    "Describe a technical problem you solved and how you approached it.",
    "What development methodologies are you familiar with?",
    "How do you ensure the quality of your work?",
    "Talk about a time you had to learn a new technology quickly.",
    "How do you approach debugging complex issues?",
    "What's your experience with [specific technical skill relevant to job]?",
  ],
  behavioral: [
    "Tell me about a time you had to work with a difficult team member.",
    "Describe a situation where you had to meet a tight deadline.",
    "How have you handled criticism of your work?",
    "Talk about a time you went above and beyond for a project.",
    "Describe a mistake you made and how you handled it.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "Give an example of how you've contributed to a team's success.",
    "Tell me about a time you had to adapt to a significant change at work.",
  ],
  leadership: [
    "Describe your leadership style.",
    "How do you motivate team members who are struggling?",
    "Tell me about a time you had to make a difficult decision as a leader.",
    "How do you delegate tasks effectively?",
    "How have you handled conflicts within your team?",
    "Describe a situation where you had to lead a team through a challenging project.",
    "How do you provide feedback to team members?",
    "Tell me about a time you had to influence someone without direct authority.",
  ],
};

// Sample evaluation criteria
const EVALUATION_CRITERIA = [
  "Clarity of response",
  "Relevance to question",
  "Communication skills",
  "Structure of answer",
  "Confidence",
];

type InterviewState = {
  isStarted: boolean;
  isFinished: boolean;
  currentQuestionIndex: number;
  currentQuestion: string;
  allQuestions: string[];
  answers: Record<number, string>;
  feedback: Record<number, string>;
  overallFeedback: string;
  score: number;
  isListening: boolean;
  isSpeaking: boolean;
  progress: number;
  category: string;
};

type InterviewContextType = {
  interviewState: InterviewState;
  startInterview: (category?: string) => void;
  endInterview: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  saveAnswer: (answer: string) => void;
  simulateEvaluation: (answer: string) => Promise<string>;
  resetInterview: () => void;
  startVoiceRecognition: () => Promise<void>;
  stopVoiceRecognition: () => void;
  speakText: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  setCustomQuestions: (questions: string[]) => void;
};

const defaultInterviewState: InterviewState = {
  isStarted: false,
  isFinished: false,
  currentQuestionIndex: 0,
  currentQuestion: "",
  allQuestions: [],
  answers: {},
  feedback: {},
  overallFeedback: "",
  score: 0,
  isListening: false,
  isSpeaking: false,
  progress: 0,
  category: "general",
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [interviewState, setInterviewState] = useState<InterviewState>(defaultInterviewState);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (utteranceRef.current && synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startInterview = useCallback((category: string = "general") => {
    const questions = category in INTERVIEW_QUESTIONS 
      ? INTERVIEW_QUESTIONS[category as keyof typeof INTERVIEW_QUESTIONS] 
      : interviewState.allQuestions.length > 0 
        ? interviewState.allQuestions 
        : INTERVIEW_QUESTIONS.general;
        
    setInterviewState(prev => ({
      ...prev,
      isStarted: true,
      currentQuestionIndex: 0,
      currentQuestion: questions[0],
      allQuestions: questions,
      category,
      progress: 0,
    }));
    
    toast({
      title: "Interview Started",
      description: "The interview has begun. Good luck!",
    });
    
    // Speak the first question
    speakText(questions[0]);
  }, [interviewState.allQuestions]);

  const endInterview = useCallback(() => {
    // Calculate overall score based on individual feedback
    const totalQuestions = Object.keys(interviewState.feedback).length;
    let overallScore = 0;
    
    if (totalQuestions > 0) {
      // In a real app, you would have actual scores in the feedback
      // This is just a placeholder calculation
      const answeredQuestions = Object.keys(interviewState.answers).length;
      const completionRatio = answeredQuestions / interviewState.allQuestions.length;
      
      // Calculate score based on feedback and completion
      const feedbackScores = Object.values(interviewState.feedback).map(feedback => {
        if (feedback.includes("Excellent")) return 100;
        if (feedback.includes("Good")) return 80;
        return 60;
      });
      
      const avgFeedbackScore = feedbackScores.reduce((sum, score) => sum + score, 0) / feedbackScores.length;
      overallScore = Math.round((avgFeedbackScore * 0.8) + (completionRatio * 100 * 0.2));
    }

    setInterviewState(prev => ({
      ...prev,
      isFinished: true,
      score: overallScore,
      overallFeedback: generateOverallFeedback(overallScore),
      progress: 100,
    }));

    stopVoiceRecognition();
    stopSpeaking();

    toast({
      title: "Interview Completed",
      description: "You've completed the interview. Check your results!",
    });
  }, [interviewState.feedback, interviewState.answers, interviewState.allQuestions]);

  const nextQuestion = useCallback(() => {
    const nextIndex = interviewState.currentQuestionIndex + 1;
    
    if (nextIndex < interviewState.allQuestions.length) {
      const progress = Math.round((nextIndex / interviewState.allQuestions.length) * 100);
      
      setInterviewState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        currentQuestion: prev.allQuestions[nextIndex],
        progress,
      }));
      
      // Speak the next question
      speakText(interviewState.allQuestions[nextIndex]);
    } else {
      // If we're at the last question, end the interview
      endInterview();
    }
  }, [interviewState.currentQuestionIndex, interviewState.allQuestions, endInterview]);

  const previousQuestion = useCallback(() => {
    const prevIndex = interviewState.currentQuestionIndex - 1;
    
    if (prevIndex >= 0) {
      const progress = Math.round((prevIndex / interviewState.allQuestions.length) * 100);
      
      setInterviewState(prev => ({
        ...prev,
        currentQuestionIndex: prevIndex,
        currentQuestion: prev.allQuestions[prevIndex],
        progress,
      }));
      
      // Speak the previous question
      speakText(interviewState.allQuestions[prevIndex]);
    }
  }, [interviewState.currentQuestionIndex, interviewState.allQuestions]);

  const saveAnswer = useCallback((answer: string) => {
    setInterviewState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestionIndex]: answer,
      },
    }));
  }, []);

  // This would be replaced with a real AI evaluation in a production app
  const simulateEvaluation = useCallback(async (answer: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // More sophisticated evaluation logic - in a real app this would be an API call to an AI service
    const answerLength = answer.length;
    const words = answer.split(/\s+/).filter(word => word.length > 0).length;
    const sentences = answer.split(/[.!?]+/).filter(sentence => sentence.length > 0).length;
    
    let feedback = "";
    let score = 0;
    
    // Evaluate based on multiple factors
    if (answerLength < 50 || words < 10) {
      feedback = "Your answer was quite brief. Consider providing more details and examples to showcase your experience and skills.";
      score = 60;
    } else if (answerLength < 200 || words < 40) {
      feedback = "Good answer. You provided some relevant details, but could elaborate more with specific examples from your experience.";
      score = 80;
    } else {
      // Check for structure - does it have multiple sentences?
      if (sentences < 3) {
        feedback = "Good response with adequate detail. Try structuring your answer with a clear beginning, middle, and end for even better results.";
        score = 85;
      } else {
        feedback = "Excellent response! You provided a comprehensive answer with good structure, specific examples, and demonstrated clear communication.";
        score = 95;
      }
    }

    // Save the feedback
    setInterviewState(prev => ({
      ...prev,
      feedback: {
        ...prev.feedback,
        [prev.currentQuestionIndex]: feedback,
      },
    }));

    return feedback;
  }, []);

  const resetInterview = useCallback(() => {
    stopVoiceRecognition();
    stopSpeaking();
    
    setInterviewState(defaultInterviewState);
    
    toast({
      title: "Interview Reset",
      description: "The interview has been reset. You can start again.",
    });
  }, []);

  // Helper function to generate overall feedback based on score
  const generateOverallFeedback = (score: number): string => {
    if (score >= 90) {
      return "Outstanding performance! You demonstrated excellent communication skills and provided thoughtful, relevant answers. You would likely impress any interviewer.";
    } else if (score >= 75) {
      return "Great job! Your answers were clear and relevant. With a bit more preparation on specific examples, you could take your interview skills to the next level.";
    } else if (score >= 60) {
      return "Good effort. You provided adequate answers but could improve by being more specific and offering concrete examples of your experiences.";
    } else {
      return "Thanks for completing the interview. We recommend practicing more with specific examples from your experience and focusing on clear, concise responses.";
    }
  };

  // Speech recognition functionality
  const startVoiceRecognition = useCallback(async (): Promise<void> => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      let finalTranscript = '';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            
            // Update the answer when we get a final result
            saveAnswer(finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setInterviewState(prev => ({ ...prev, isListening: false }));
        
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        setInterviewState(prev => ({ ...prev, isListening: false }));
      };
      
      recognitionRef.current.start();
      setInterviewState(prev => ({ ...prev, isListening: true }));
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  }, [saveAnswer]);

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setInterviewState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  // Text-to-speech functionality
  const speakText = useCallback(async (text: string): Promise<void> => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    
    // Stop any ongoing speech
    stopSpeaking();
    
    // Create and configure speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to find a good voice
    if (synthRef.current && synthRef.current.getVoices().length > 0) {
      const voices = synthRef.current.getVoices();
      // Try to find a neutral, professional-sounding voice
      const preferredVoice = voices.find(voice => 
        (voice.name.includes('Daniel') || voice.name.includes('Google') || voice.name.includes('Microsoft')) && 
        voice.lang.includes('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    
    utterance.onstart = () => {
      setInterviewState(prev => ({ ...prev, isSpeaking: true }));
    };
    
    utterance.onend = () => {
      setInterviewState(prev => ({ ...prev, isSpeaking: false }));
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setInterviewState(prev => ({ ...prev, isSpeaking: false }));
      utteranceRef.current = null;
    };
    
    utteranceRef.current = utterance;
    
    if (synthRef.current) {
      synthRef.current.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setInterviewState(prev => ({ ...prev, isSpeaking: false }));
      utteranceRef.current = null;
    }
  }, []);

  // Set custom questions
  const setCustomQuestions = useCallback((questions: string[]) => {
    if (questions.length > 0) {
      setInterviewState(prev => ({
        ...prev,
        allQuestions: questions,
        currentQuestion: questions[0],
        category: "custom",
      }));
    }
  }, []);

  // Update the current question when the index changes
  useEffect(() => {
    if (interviewState.isStarted && !interviewState.isFinished) {
      setInterviewState(prev => ({
        ...prev,
        currentQuestion: prev.allQuestions[prev.currentQuestionIndex],
      }));
    }
  }, [interviewState.currentQuestionIndex]);

  const value = {
    interviewState,
    startInterview,
    endInterview,
    nextQuestion,
    previousQuestion,
    saveAnswer,
    simulateEvaluation,
    resetInterview,
    startVoiceRecognition,
    stopVoiceRecognition,
    speakText,
    stopSpeaking,
    setCustomQuestions,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

// TypeScript declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
