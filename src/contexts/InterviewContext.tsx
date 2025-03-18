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
  feedback: Record<number, string | any>;
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
  isGeneratingQuestion: boolean;
  followUpMode: boolean;
};

type InterviewContextType = {
  interviewState: InterviewState;
  startInterview: (category?: string) => void;
  endInterview: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  saveAnswer: (answer: string) => void;
  simulateEvaluation: (answer: string) => Promise<string | any>;
  resetInterview: () => void;
  startVoiceRecognition: () => Promise<void>;
  stopVoiceRecognition: () => void;
  speakText: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  setCustomQuestions: (questions: string[]) => void;
  setInterviewCharacter: (character: typeof AI_CHARACTERS[0]) => void;
  generateFollowUpQuestion: (previousAnswer: string) => Promise<void>;
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
  isGeneratingQuestion: false,
  followUpMode: false,
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}

interface InterviewProviderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export function InterviewProvider({ children, apiKey = "" }: InterviewProviderProps) {
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

  const generateInterviewQuestions = async (category: string, count: number = 8): Promise<string[]> => {
    try {
      setInterviewState(prev => ({
        ...prev,
        isGeneratingQuestion: true
      }));
      
      // Use OpenAI API if key is provided, otherwise fallback to Perplexity
      if (apiKey) {
        try {
          console.log("Using OpenAI API for question generation");
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                  content: `You are an expert interviewer for ${category} interviews. Generate ${count} challenging interview questions that a professional interviewer would ask. Each question should be thorough and designed to assess a candidate's experience, skills, and thinking process. Format your response as a JSON array of strings.`
                },
                {
                  role: "user",
                  content: `Please generate ${count} professional interview questions for the ${category} category. These should be questions a real interviewer would ask.`
                }
              ],
              temperature: 0.8,
              max_tokens: 1000
            })
          });

          if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
          }

          const data = await response.json();
          
          try {
            const contentText = data.choices[0].message.content;
            const jsonMatch = contentText.match(/\[[\s\S]*\]/);
            
            if (jsonMatch) {
              const questions = JSON.parse(jsonMatch[0]);
              return Array.isArray(questions) ? questions : [];
            } else {
              const lines = contentText.split('\n').filter(line => 
                line.trim().length > 0 && 
                (line.includes('?') || /^\d+\./.test(line.trim()))
              );
              return lines.slice(0, count);
            }
          } catch (parseError) {
            console.error("Error parsing OpenAI API response:", parseError);
            throw parseError;
          }
        } catch (error) {
          console.error("Error with OpenAI, falling back to Perplexity:", error);
          toast({
            title: "OpenAI API Error",
            description: "Could not connect to OpenAI. Falling back to default AI.",
            variant: "destructive",
          });
          // Continue to Perplexity fallback
        }
      }
      
      // Fallback to Perplexity
      const perplexityKey = "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";
      
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${perplexityKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an expert interviewer for ${category} interviews. Generate ${count} challenging interview questions that a professional interviewer would ask. Each question should be thorough and designed to assess a candidate's experience, skills, and thinking process. Format your response as a JSON array of strings.`
            },
            {
              role: "user",
              content: `Please generate ${count} professional interview questions for the ${category} category. These should be questions a real interviewer would ask.`
            }
          ],
          temperature: 0.8,
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
        const jsonMatch = contentText.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return Array.isArray(questions) ? questions : [];
        } else {
          const lines = contentText.split('\n').filter(line => 
            line.trim().length > 0 && 
            (line.includes('?') || /^\d+\./.test(line.trim()))
          );
          return lines.slice(0, count);
        }
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        return [];
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      return [];
    } finally {
      setInterviewState(prev => ({
        ...prev,
        isGeneratingQuestion: false
      }));
    }
  };
  
  const generateFollowUpQuestion = async (previousAnswer: string): Promise<void> => {
    try {
      setInterviewState(prev => ({
        ...prev,
        isGeneratingQuestion: true
      }));
      
      const currentQuestion = interviewState.currentQuestion;
      
      // Use OpenAI API if key is provided, otherwise fallback to Perplexity
      if (apiKey) {
        try {
          console.log("Using OpenAI API for follow-up generation");
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                  content: "You are a professional interviewer asking follow-up questions. Based on the candidate's previous answer, generate a single, relevant follow-up question to dig deeper or clarify their response. Make it sound natural, as a real interviewer would ask. Return only the follow-up question with no prefix or explanation."
                },
                {
                  role: "user",
                  content: `Original question: "${currentQuestion}"\n\nCandidate's answer: "${previousAnswer}"\n\nProvide a relevant follow-up question to dig deeper into their response.`
                }
              ],
              temperature: 0.7,
              max_tokens: 150
            })
          });

          if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
          }

          const data = await response.json();
          const followUpQuestion = data.choices[0].message.content.trim();
          
          if (followUpQuestion) {
            updateQuestionsWithFollowup(followUpQuestion);
            return;
          }
        } catch (error) {
          console.error("Error with OpenAI, falling back to Perplexity:", error);
          // Continue to Perplexity fallback
        }
      }
      
      // Fallback to Perplexity
      const perplexityKey = "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";
      
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${perplexityKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a professional interviewer asking follow-up questions. Based on the candidate's previous answer, generate a single, relevant follow-up question to dig deeper or clarify their response. Make it sound natural, as a real interviewer would ask. Return only the follow-up question with no prefix or explanation."
            },
            {
              role: "user",
              content: `Original question: "${currentQuestion}"\n\nCandidate's answer: "${previousAnswer}"\n\nProvide a relevant follow-up question to dig deeper into their response.`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const followUpQuestion = data.choices[0].message.content.trim();
      
      if (followUpQuestion) {
        updateQuestionsWithFollowup(followUpQuestion);
      }
    } catch (error) {
      console.error("Error generating follow-up question:", error);
      toast({
        title: "Error",
        description: "Could not generate a follow-up question. Please continue with the next question.",
        variant: "destructive",
      });
      setInterviewState(prev => ({
        ...prev,
        followUpMode: false
      }));
    } finally {
      setInterviewState(prev => ({
        ...prev,
        isGeneratingQuestion: false
      }));
    }
  };

  const updateQuestionsWithFollowup = (followUpQuestion: string) => {
    setInterviewState(prev => {
      const updatedQuestions = [...prev.allQuestions];
      
      updatedQuestions.splice(prev.currentQuestionIndex + 1, 0, followUpQuestion);
      
      const updatedAnswers: Record<number, string> = {};
      const updatedFeedback: Record<number, string> = {};
      const updatedImprovedAnswers: Record<number, string> = {};
      
      Object.entries(prev.answers).forEach(([index, answer]) => {
        const numIndex = Number(index);
        if (numIndex > prev.currentQuestionIndex) {
          updatedAnswers[numIndex + 1] = answer;
        } else {
          updatedAnswers[numIndex] = answer;
        }
      });
      
      Object.entries(prev.feedback).forEach(([index, feedback]) => {
        const numIndex = Number(index);
        if (numIndex > prev.currentQuestionIndex) {
          updatedFeedback[numIndex + 1] = feedback;
        } else {
          updatedFeedback[numIndex] = feedback;
        }
      });
      
      Object.entries(prev.improvedAnswers).forEach(([index, improved]) => {
        const numIndex = Number(index);
        if (numIndex > prev.currentQuestionIndex) {
          updatedImprovedAnswers[numIndex + 1] = improved;
        } else {
          updatedImprovedAnswers[numIndex] = improved;
        }
      });
      
      return {
        ...prev,
        allQuestions: updatedQuestions,
        followUpMode: false,
        answers: updatedAnswers,
        feedback: updatedFeedback,
        improvedAnswers: updatedImprovedAnswers,
      };
    });
    
    nextQuestion();
  };

  const startInterview = useCallback(async (category: string = "general") => {
    let questions = [];
    
    try {
      toast({
        title: "Generating Questions",
        description: "Using AI to prepare personalized interview questions...",
      });
      
      const generatedQuestions = await generateInterviewQuestions(category);
      
      if (generatedQuestions.length >= 4) {
        questions = generatedQuestions;
      } else {
        questions = category in INTERVIEW_QUESTIONS 
          ? INTERVIEW_QUESTIONS[category as keyof typeof INTERVIEW_QUESTIONS] 
          : interviewState.allQuestions.length > 0 
            ? interviewState.allQuestions 
            : INTERVIEW_QUESTIONS.general;
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      
      questions = category in INTERVIEW_QUESTIONS 
        ? INTERVIEW_QUESTIONS[category as keyof typeof INTERVIEW_QUESTIONS] 
        : interviewState.allQuestions.length > 0 
          ? interviewState.allQuestions 
          : INTERVIEW_QUESTIONS.general;
    }
        
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

  const analyzeAnswerWithOpenAI = async (question: string, answer: string): Promise<{ feedback: string | any; improvedAnswer: string }> => {
    try {
      // Use OpenAI API if key is provided, otherwise fallback to Perplexity
      if (apiKey) {
        try {
          console.log("Using OpenAI API for answer analysis");
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
                  content: `You are an expert interview coach specializing in providing detailed, constructive feedback.
                  
                  Analyze the candidate's interview answer and provide:
                  
                  1) STRENGTHS: What specific parts of the answer were effective.
                  2) WEAKNESSES: What specific areas need improvement.
                  3) KEY POINTS MISSED: Important points or concepts that should have been included.
                  4) IMPROVEMENT SUGGESTIONS: Concrete, actionable tips to make the answer stronger.
                  5) IMPROVED ANSWER: A rewritten version that addresses all the weaknesses and incorporates the missed key points.
                  
                  Be extremely detailed and constructive. Your feedback should help the candidate significantly improve their interview skills. If it's a short or incomplete answer, be honest but provide guidance on structure and content for a proper response.
                  
                  Format your response as a JSON object with 'feedback' (containing all feedback points in a structured format) and 'improvedAnswer' fields.`
                },
                {
                  role: "user",
                  content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nPlease analyze this answer and provide detailed feedback and an improved version.`
                }
              ],
              temperature: 0.7,
              max_tokens: 1500
            })
          });

          if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.statusText}`);
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
              throw new Error("Could not extract JSON from OpenAI response");
            }
          } catch (parseError) {
            console.error("Error parsing OpenAI API response:", parseError);
            throw parseError;
          }
        } catch (error) {
          console.error("Error with OpenAI, falling back to Perplexity:", error);
          // Continue to Perplexity fallback
        }
      }
      
      // Fallback to Perplexity
      const perplexityKey = "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";
      
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${perplexityKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an expert interview coach specializing in providing detailed, constructive feedback.
              
              Analyze the candidate's interview answer and provide:
              
              1) STRENGTHS: What specific parts of the answer were effective.
              2) WEAKNESSES: What specific areas need improvement.
              3) KEY POINTS MISSED: Important points or concepts that should have been included.
              4) IMPROVEMENT SUGGESTIONS: Concrete, actionable tips to make the answer stronger.
              5) IMPROVED ANSWER: A rewritten version that addresses all the weaknesses and incorporates the missed key points.
              
              Format your response as a JSON object with 'feedback' (containing all feedback points in a structured format) and 'improvedAnswer' fields.`
            },
            {
              role: "user",
              content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nPlease analyze this answer and provide detailed feedback and an improved version.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
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
        return {
          feedback: data.choices[0].message.content || "Analysis unavailable.",
          improvedAnswer: "No improved answer available."
        };
      }
    } catch (error) {
      console.error("Error calling AI API:", error);
      throw error;
    }
  };

  const simulateEvaluation = useCallback(async (answer: string): Promise<string | any> => {
    setInterviewState(prev => ({
      ...prev,
      isAnalyzing: true,
      followUpMode: true
    }));
    
    try {
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
      
      await new Promise(resolve => setTimeout(resolve, 800));
    
      const answerLength = answer.length;
      const words = answer.split(/\s+/).filter(word => word.length > 0).length;
      const sentences = answer.split(/[.!?]+/).filter(sentence => sentence.length > 0).length;
      
      let feedback = {
        "STRENGTHS": "You provided a response.",
        "WEAKNESSES": "Your answer was quite brief. Consider providing more details.",
        "KEY POINTS MISSED": "You didn't include specific examples or structured your response well.",
        "IMPROVEMENT SUGGESTIONS": "Try using the STAR method (Situation, Task, Action, Result) for behavioral questions."
      };
      
      if (answerLength < 50 || words < 10) {
        feedback = {
          "STRENGTHS": "You attempted to answer the question.",
          "WEAKNESSES": "Your answer was too brief and lacked substance. It doesn't give the interviewer enough information about your skills and experience.",
          "KEY POINTS MISSED": "You didn't include specific examples, details about your experience, or demonstrate relevant skills.",
          "IMPROVEMENT SUGGESTIONS": "Expand your answer to at least 3-5 sentences. Include a specific example that demonstrates your abilities. Use the STAR method if applicable."
        };
      } else if (answerLength < 200 || words < 40) {
        feedback = {
          "STRENGTHS": "You provided some relevant information in your answer.",
          "WEAKNESSES": "While you gave some information, your answer could benefit from more details and specific examples.",
          "KEY POINTS MISSED": "Your answer lacked depth and specific examples that showcase your skills and experience.",
          "IMPROVEMENT SUGGESTIONS": "Elaborate with concrete examples from your past experience. Quantify your achievements when possible."
        };
      } else {
        if (sentences < 3) {
          feedback = {
            "STRENGTHS": "You provided a substantial amount of information in your answer.",
            "WEAKNESSES": "Your answer could benefit from better structure and flow between ideas.",
            "KEY POINTS MISSED": "Your response may lack a clear beginning, middle, and end structure.",
            "IMPROVEMENT SUGGESTIONS": "Try structuring your answer with a clear introduction, main points, and conclusion. Break up long sentences for clarity."
          };
        } else {
          feedback = {
            "STRENGTHS": "Excellent response! You provided comprehensive information with good structure.",
            "WEAKNESSES": "Minor areas for improvement could include being more concise in some areas.",
            "KEY POINTS MISSED": "Consider adding more quantifiable results if applicable.",
            "IMPROVEMENT SUGGESTIONS": "Continue to refine your delivery and consider preparing additional examples for similar questions."
          };
        }
      }

      // Generate a basic improved answer
      const improvedAnswer = generateBasicImprovedAnswer(interviewState.currentQuestion, answer);

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
    }
  }, [interviewState.allQuestions, interviewState.currentQuestionIndex]);

  const generateBasicImprovedAnswer = (question: string, originalAnswer: string): string => {
    // This is a simple fallback function to create an improved answer when the AI analysis fails
    if (originalAnswer.length < 50) {
      return `I would like to provide more context about this. ${originalAnswer} Additionally, I have experience in this area and have successfully handled similar situations in the past. For example, [insert specific example]. The key takeaway was [describe outcome or lesson learned].`;
    } else if (originalAnswer.length < 200) {
      return `${originalAnswer}\n\nTo elaborate further, I would add some specific metrics or results that demonstrate the impact of my actions. I would also structure my response using the STAR method (Situation, Task, Action, Result) to make it clearer and more compelling.`;
    } else {
      return `${originalAnswer}\n\nTo make this answer even stronger, I would ensure I've clearly connected my experience to the specific requirements of the role, and emphasized not just what I did but what I learned and how it shaped my professional development.`;
    }
  };

  const generateOverallFeedback = (score: number): string => {
    if (score >= 90) {
      return "Excellent performance! Your responses were clear, detailed, and highly relevant. You demonstrated strong communication skills and provided specific examples to support your points. You're well-prepared for professional interviews.";
    } else if (score >= 75) {
      return "Good performance! Your responses were generally effective and relevant. With some refinement in structure and more specific examples, you'll be very well-prepared for professional interviews.";
    } else if (score >= 60) {
      return "Satisfactory performance. Your responses covered the basics, but could benefit from more specific examples, better structure, and deeper insights. Continue practicing with the suggested improvements.";
    } else {
      return "Your interview needs improvement. Focus on providing more detailed and structured responses with specific examples from your experience. Practice using the STAR method for behavioral questions and work on communicating your value more effectively.";
    }
  };

  const startVoiceRecognition = async () => {
    try {
      if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          const fullTranscript = (finalTranscript || interimTranscript).trim();
          
          setInterviewState(prev => ({
            ...prev,
            transcription: fullTranscript
          }));
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          
          stopVoiceRecognition();
          
          toast({
            title: "Voice Recognition Error",
            description: `Error: ${event.error}. Please try again or type your answer.`,
            variant: "destructive",
          });
        };
        
        recognition.start();
        recognitionRef.current = recognition;
        
        setInterviewState(prev => ({
          ...prev,
          isListening: true
        }));
      } else {
        toast({
          title: "Not Supported",
          description: "Voice recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      
      toast({
        title: "Voice Recognition Error",
        description: "Could not start voice recognition. Please try again or type your answer.",
        variant: "destructive",
      });
    }
  };
  
  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      
      setInterviewState(prev => ({
        ...prev,
        isListening: false
      }));
    }
  };

  const speakText = async (text: string) => {
    if (typeof window !== 'undefined' && synthRef.current) {
      // Cancel any ongoing speech
      stopSpeaking();
      
      try {
        // Create a new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set properties
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Try to use a female voice if available
        const voices = synthRef.current.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.includes('female') || 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') ||
          voice.name.includes('Google UK English Female')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        
        // Set events
        utterance.onstart = () => {
          setInterviewState(prev => ({
            ...prev,
            isSpeaking: true
          }));
        };
        
        utterance.onend = () => {
          setInterviewState(prev => ({
            ...prev,
            isSpeaking: false,
            questionSpoken: true
          }));
          utteranceRef.current = null;
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setInterviewState(prev => ({
            ...prev,
            isSpeaking: false,
            questionSpoken: true
          }));
          utteranceRef.current = null;
        };
        
        // Store the utterance and speak
        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error('Error speaking text:', error);
        setInterviewState(prev => ({
          ...prev,
          isSpeaking: false,
          questionSpoken: true
        }));
      }
    } else {
      console.log('Speech synthesis not available');
      setInterviewState(prev => ({
        ...prev,
        questionSpoken: true
      }));
    }
  };
  
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && synthRef.current) {
      synthRef.current.cancel();
      
      setInterviewState(prev => ({
        ...prev,
        isSpeaking: false
      }));
      
      utteranceRef.current = null;
    }
  };

  const resetInterview = () => {
    stopVoiceRecognition();
    stopSpeaking();
    
    setInterviewState({
      ...defaultInterviewState,
      selectedCharacter: interviewState.selectedCharacter
    });
  };

  const setCustomQuestions = (questions: string[]) => {
    if (questions.length > 0) {
      setInterviewState(prev => ({
        ...prev,
        allQuestions: questions,
        currentQuestion: questions[0],
      }));
    }
  };
  
  const setInterviewCharacter = (character: typeof AI_CHARACTERS[0]) => {
    setInterviewState(prev => ({
      ...prev,
      selectedCharacter: character
    }));
  };

  return (
    <InterviewContext.Provider
      value={{
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
        generateFollowUpQuestion,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
