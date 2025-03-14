
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

// Sample interview questions
const QUESTIONS = [
  "Tell me about yourself.",
  "What are your strengths and weaknesses?",
  "Why do you want to work for this company?",
  "Describe a challenging situation at work and how you handled it.",
  "Where do you see yourself in 5 years?",
  "What experience do you have in this field?",
  "How do you handle stress and pressure?",
  "Describe your work ethic.",
];

// Sample evaluation criteria
const EVALUATION_CRITERIA = [
  "Clarity of response",
  "Relevance to question",
  "Communication skills",
  "Body language",
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
};

type InterviewContextType = {
  interviewState: InterviewState;
  startInterview: () => void;
  endInterview: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  saveAnswer: (answer: string) => void;
  simulateEvaluation: (answer: string) => Promise<string>;
  resetInterview: () => void;
};

const defaultInterviewState: InterviewState = {
  isStarted: false,
  isFinished: false,
  currentQuestionIndex: 0,
  currentQuestion: QUESTIONS[0],
  allQuestions: QUESTIONS,
  answers: {},
  feedback: {},
  overallFeedback: "",
  score: 0,
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

  const startInterview = () => {
    setInterviewState(prev => ({
      ...prev,
      isStarted: true,
      currentQuestionIndex: 0,
      currentQuestion: QUESTIONS[0],
    }));
    toast({
      title: "Interview Started",
      description: "The interview has begun. Good luck!",
    });
  };

  const endInterview = () => {
    // Calculate overall score based on individual feedback
    const totalQuestions = Object.keys(interviewState.feedback).length;
    let overallScore = 0;
    
    if (totalQuestions > 0) {
      // In a real app, you would have actual scores in the feedback
      // This is just a placeholder calculation
      overallScore = Math.round(Math.random() * 100);
    }

    setInterviewState(prev => ({
      ...prev,
      isFinished: true,
      score: overallScore,
      overallFeedback: generateOverallFeedback(overallScore),
    }));

    toast({
      title: "Interview Completed",
      description: "You've completed the interview. Check your results!",
    });
  };

  const nextQuestion = () => {
    const nextIndex = interviewState.currentQuestionIndex + 1;
    
    if (nextIndex < interviewState.allQuestions.length) {
      setInterviewState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        currentQuestion: prev.allQuestions[nextIndex],
      }));
    } else {
      // If we're at the last question, end the interview
      endInterview();
    }
  };

  const previousQuestion = () => {
    const prevIndex = interviewState.currentQuestionIndex - 1;
    
    if (prevIndex >= 0) {
      setInterviewState(prev => ({
        ...prev,
        currentQuestionIndex: prevIndex,
        currentQuestion: prev.allQuestions[prevIndex],
      }));
    }
  };

  const saveAnswer = (answer: string) => {
    setInterviewState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestionIndex]: answer,
      },
    }));
  };

  // This would be replaced with a real AI evaluation in a production app
  const simulateEvaluation = async (answer: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple evaluation logic - in a real app this would be an API call to an AI service
    const answerLength = answer.length;
    let feedback = "";
    
    if (answerLength < 50) {
      feedback = "Your answer was quite brief. Consider elaborating more to showcase your experience and skills.";
    } else if (answerLength < 200) {
      feedback = "Good answer. You provided some relevant details, but could add more specifics about your experience.";
    } else {
      feedback = "Excellent response! You provided a comprehensive answer with good examples and demonstrated clear communication.";
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
  };

  const resetInterview = () => {
    setInterviewState(defaultInterviewState);
    toast({
      title: "Interview Reset",
      description: "The interview has been reset. You can start again.",
    });
  };

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
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}
