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

// AI Interviewer Characters
export const AI_CHARACTERS = [
  {
    id: "professional",
    name: "Alex",
    title: "Professional Recruiter",
    description: "A straightforward corporate recruiter focused on qualifications and experience.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150",
    style: "professional",
  },
  {
    id: "friendly",
    name: "Sarah",
    title: "Friendly HR Manager",
    description: "A warm and encouraging interviewer who creates a comfortable atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
    style: "friendly",
  },
  {
    id: "technical",
    name: "Marcus",
    title: "Technical Lead",
    description: "A detail-oriented interviewer who digs deep into technical skills and problem-solving.",
    imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150",
    style: "technical",
  },
  {
    id: "executive",
    name: "Claire",
    title: "Executive Interviewer",
    description: "A senior leader who evaluates leadership potential and strategic thinking.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
    style: "executive",
  }
];

type InterviewState = {
  isStarted: boolean;
  isFinished: boolean;
  currentQuestionIndex: number;
  currentQuestion: string;
  allQuestions: string[];
  answers: Record<number, string>;
  feedback: Record<number, string>;
  improvedAnswers: Record<number, string>;
  overallFeedback: string;
  score: number;
  isListening: boolean;
  isSpeaking: boolean;
  progress: number;
  category: string;
  questionSpoken: boolean;
  transcription: string;
  selectedCharacter: typeof AI_CHARACTERS[0];
  isAnalyzing: boolean;
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
  setInterviewCharacter: (character: typeof AI_CHARACTERS[0]) => void;
};

const defaultInterviewState: InterviewState = {
  isStarted: false,
  isFinished: false,
  currentQuestionIndex: 0,
  currentQuestion: "",
  allQuestions: [],
  answers: {},
  feedback: {},
  improvedAnswers: {},
  overallFeedback: "",
  score: 0,
  isListening: false,
  isSpeaking: false,
  progress: 0,
  category: "general",
  questionSpoken: false,
  transcription: "",
  selectedCharacter: AI_CHARACTERS[0],
  isAnalyzing: false,
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
      questionSpoken: false,
    }));
    
    toast({
      title: "Interview Started",
      description: "The interview has begun. Good luck!",
    });
    
    speakText(questions[0]);
  }, [interviewState.allQuestions]);

  const endInterview = useCallback(() => {
    const totalQuestions = Object.keys(interviewState.feedback).length;
    let overallScore = 0;
    
    if (totalQuestions > 0) {
      const answeredQuestions = Object.keys(interviewState.answers).length;
      const completionRatio = answeredQuestions / interviewState.allQuestions.length;
      
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
        questionSpoken: false,
      }));
      
      speakText(interviewState.allQuestions[nextIndex]);
    } else {
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
        questionSpoken: false,
      }));
      
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

  const analyzeAnswerWithOpenAI = async (question: string, answer: string): Promise<{ feedback: string; improvedAnswer: string }> => {
    try {
      const apiKey = "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";
      
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert interview coach. Analyze the candidate's answer to the interview question and provide: 1) Constructive feedback on strengths and weaknesses 2) An improved version of the answer that addresses the weaknesses. Format your response as a JSON object with 'feedback' and 'improvedAnswer' fields."
            },
            {
              role: "user",
              content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nPlease analyze this answer and provide feedback and an improved version.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        console.error("API request failed:", response.statusText);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      try {
        const contentText = data.choices[0].message.content;
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const jsonContent = JSON.parse(jsonMatch[0]);
          return {
            feedback: jsonContent.feedback || "No specific feedback available.",
            improvedAnswer: jsonContent.improvedAnswer || "No improved answer available."
          };
        } else {
          throw new Error("Could not extract JSON from response");
        }
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        // Fallback to treating the entire content as feedback
        return {
          feedback: data.choices[0].message.content || "Analysis unavailable.",
          improvedAnswer: "No improved answer available."
        };
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  };

  const simulateEvaluation = useCallback(async (answer: string): Promise<string> => {
    setInterviewState(prev => ({
      ...prev,
      isAnalyzing: true
    }));
    
    try {
      // First try to get AI-powered feedback
      const currentQuestion = interviewState.allQuestions[interviewState.currentQuestionIndex];
      const { feedback, improvedAnswer } = await analyzeAnswerWithOpenAI(currentQuestion, answer);
      
      setInterviewState(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [prev.currentQuestionIndex]: feedback,
        },
        improvedAnswers: {
          ...prev.improvedAnswers,
          [prev.currentQuestionIndex]: improvedAnswer,
        },
        isAnalyzing: false
      }));
      
      return feedback;
    } catch (error) {
      console.error("Error with AI evaluation, falling back to simple evaluation:", error);
      
      // Fallback to simple evaluation
      await new Promise(resolve => setTimeout(resolve, 800));
    
      const answerLength = answer.length;
      const words = answer.split(/\s+/).filter(word => word.length > 0).length;
      const sentences = answer.split(/[.!?]+/).filter(sentence => sentence.length > 0).length;
      
      let feedback = "";
      
      if (answerLength < 50 || words < 10) {
        feedback = "Your answer was quite brief. Consider providing more details and examples to showcase your experience and skills.";
      } else if (answerLength < 200 || words < 40) {
        feedback = "Good answer. You provided some relevant details, but could elaborate more with specific examples from your experience.";
      } else {
        if (sentences < 3) {
          feedback = "Good response with adequate detail. Try structuring your answer with a clear beginning, middle, and end for even better results.";
        } else {
          feedback = "Excellent response! You provided a comprehensive answer with good structure, specific examples, and demonstrated clear communication.";
        }
      }

      setInterviewState(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [prev.currentQuestionIndex]: feedback,
        },
        isAnalyzing: false
      }));

      return feedback;
    }
  }, [interviewState.allQuestions, interviewState.currentQuestionIndex]);

  const resetInterview = useCallback(() => {
    stopVoiceRecognition();
    stopSpeaking();
    
    setInterviewState(defaultInterviewState);
    
    toast({
      title: "Interview Reset",
      description: "The interview has been reset. You can start again.",
    });
  }, []);

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
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      let finalTranscript = '';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            
            saveAnswer(finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
            
            setInterviewState(prev => ({
              ...prev,
              transcription: finalTranscript + interimTranscript
            }));
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setInterviewState(prev => ({ 
          ...prev, 
          isListening: false,
          transcription: ""
        }));
        
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
      setInterviewState(prev => ({ 
        ...prev, 
        isListening: true,
        transcription: ""
      }));
      
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
      setInterviewState(prev => ({ 
        ...prev, 
        isListening: false,
        transcription: ""
      }));
    }
  }, []);

  const speakText = useCallback(async (text: string): Promise<void> => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    
    if (interviewState.questionSpoken && text === interviewState.currentQuestion) {
      return;
    }
    
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (synthRef.current && synthRef.current.getVoices().length > 0) {
      const voices = synthRef.current.getVoices();
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
      setInterviewState(prev => ({ 
        ...prev, 
        isSpeaking: false,
        questionSpoken: prev.currentQuestion === text ? true : prev.questionSpoken
      }));
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
  }, [interviewState.questionSpoken, interviewState.currentQuestion]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setInterviewState(prev => ({ ...prev, isSpeaking: false }));
      utteranceRef.current = null;
    }
  }, []);

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

  const setInterviewCharacter = useCallback((character: typeof AI_CHARACTERS[0]) => {
    setInterviewState(prev => ({
      ...prev,
      selectedCharacter: character,
    }));
  }, []);

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
    setInterviewCharacter,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
