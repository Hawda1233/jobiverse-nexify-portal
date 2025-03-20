import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateSpeech, playAudioBuffer, analyzeInterviewResponse, getAdvancedChatCompletion } from "@/utils/openAIService";

// Google AI API key
const GOOGLE_AI_API_KEY = "AIzaSyAW-mL4hLOYBtwq6KdWshXFLR1ksCTp9fw";

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
    voice: "nova" as const
  },
  {
    id: "friendly",
    name: "Sarah",
    title: "Friendly HR Manager",
    description: "A warm and encouraging interviewer who creates a comfortable atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150",
    style: "friendly",
    voice: "nova" as const
  },
  {
    id: "technical",
    name: "Marcus",
    title: "Technical Lead",
    description: "A detail-oriented interviewer who digs deep into technical skills and problem-solving.",
    imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150",
    style: "technical",
    voice: "onyx" as const
  },
  {
    id: "executive",
    name: "Claire",
    title: "Executive Interviewer",
    description: "A senior leader who evaluates leadership potential and strategic thinking.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150",
    style: "executive",
    voice: "shimmer" as const
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
  difficulty: string;
  questionSpoken: boolean;
  transcription: string;
  selectedCharacter: typeof AI_CHARACTERS[0];
  isAnalyzing: boolean;
  isGeneratingQuestion: boolean;
  followUpMode: boolean;
  currentSkillLevel: string;
  isGeneratingVoice: boolean;
  isUsingOpenAI: boolean;
};

type InterviewContextType = {
  interviewState: InterviewState;
  startInterview: (category?: string, difficulty?: string) => void;
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
  getCurrentSkillLevel: () => string;
  useTTS: (text: string) => Promise<void>;
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
  difficulty: "medium",
  questionSpoken: false,
  transcription: "",
  selectedCharacter: AI_CHARACTERS[0],
  isAnalyzing: false,
  isGeneratingQuestion: false,
  followUpMode: false,
  currentSkillLevel: "intermediate",
  isGeneratingVoice: false,
  isUsingOpenAI: true
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
  googleApiKey?: string;
}

export function InterviewProvider({ children, apiKey = "", googleApiKey = GOOGLE_AI_API_KEY }: InterviewProviderProps) {
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

  const callGoogleAI = async (prompt: string): Promise<any> => {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GOOGLE_AI_API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Google AI API request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error calling Google AI API:", error);
      throw error;
    }
  };

  const generateInterviewQuestions = async (category: string, difficulty: string = "medium", count: number = 8): Promise<string[]> => {
    try {
      setInterviewState(prev => ({
        ...prev,
        isGeneratingQuestion: true
      }));
      
      // Try to use Google AI API first
      try {
        console.log("Using Google AI API for question generation");
        const prompt = `You are an expert interviewer for ${category} interviews. Generate ${count} ${difficulty} difficulty interview questions that a professional interviewer would ask. Each question should be thorough and designed to assess a candidate's experience, skills, and thinking process. Format your response as a numbered list of questions.`;
        
        const response = await callGoogleAI(prompt);
        
        // Parse response into individual questions
        const questions = response.split(/\d+\./).filter((q: string) => q.trim().length > 0).map((q: string) => q.trim());
        
        if (questions.length >= count / 2) {
          return questions.slice(0, count);
        }
      } catch (error) {
        console.error("Error with Google AI, falling back to OpenAI:", error);
      }
      
      // If Google AI fails, try OpenAI API if key is provided
      if (apiKey) {
        try {
          console.log("Using provided API key for question generation");
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
                  content: `You are an expert interviewer for ${category} interviews. Generate ${count} ${difficulty} difficulty interview questions that a professional interviewer would ask. Each question should be thorough and designed to assess a candidate's experience, skills, and thinking process. Format your response as a JSON array of strings.`
                },
                {
                  role: "user",
                  content: `Please generate ${count} professional ${difficulty} level interview questions for the ${category} category. These should be questions a real interviewer would ask.`
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
          console.error("Error with API, falling back to default questions:", error);
          // Continue to fallback questions
        }
      }
      
      // Fallback to default questions if API fails or no key
      const defaultQuestions = category in INTERVIEW_QUESTIONS 
          ? INTERVIEW_QUESTIONS[category as keyof typeof INTERVIEW_QUESTIONS] 
          : INTERVIEW_QUESTIONS.general;
          
      return defaultQuestions;
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
      
      if (apiKey && interviewState.isUsingOpenAI) {
        try {
          console.log("Using OpenAI for follow-up generation");
          
          const systemMessage = `You are a professional ${interviewState.selectedCharacter.style} interviewer. 
          Based on the candidate's previous answer, generate a single, relevant follow-up question to dig deeper into their response.
          Make it sound natural and conversational, as a real interviewer would ask. The follow-up should be challenging but fair, and relevant to their previous answer.
          Your question should help assess their knowledge, skills, and fit for the role further.
          Return only the follow-up question with no prefix or explanation.`;
          
          const response = await getAdvancedChatCompletion(
            [
              { role: "system", content: systemMessage },
              { role: "user", content: `Original question: "${currentQuestion}"\n\nCandidate's answer: "${previousAnswer}"\n\nProvide a single, relevant follow-up question that digs deeper into their response.` }
            ],
            apiKey,
            { 
              temperature: 0.7,
              skillLevel: interviewState.currentSkillLevel as 'beginner' | 'intermediate' | 'expert'
            }
          );
          
          const followUpQuestion = response.choices[0].message.content.trim();
          
          if (followUpQuestion) {
            updateQuestionsWithFollowup(followUpQuestion);
            return;
          }
        } catch (error) {
          console.error("Error with OpenAI, falling back to Google AI:", error);
        }
      }
      
      // Try Google AI if OpenAI fails or is not available
      try {
        const prompt = `Original question: "${currentQuestion}"\n\nCandidate's answer: "${previousAnswer}"\n\nAs a professional interviewer, provide a single, relevant follow-up question to dig deeper into their response. Make it sound natural, as a real interviewer would ask. Return only the follow-up question with no prefix or explanation.`;
        
        const followUpQuestion = await callGoogleAI(prompt);
        
        if (followUpQuestion) {
          updateQuestionsWithFollowup(followUpQuestion);
          return;
        }
      } catch (error) {
        console.error("Error with Google AI, falling back to default question:");
        toast({
          title: "Error",
          description: "Could not generate a follow-up question. Please continue with the next question.",
          variant: "destructive",
        });
        setInterviewState(prev => ({
          ...prev,
          followUpMode: false
        }));
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

  const startInterview = useCallback(async (category: string = "general", difficulty: string = "medium") => {
    let questions = [];
    
    try {
      toast({
        title: "Generating Questions",
        description: `Using AI to prepare personalized ${difficulty} difficulty interview questions...`,
      });
      
      const generatedQuestions = await generateInterviewQuestions(category, difficulty);
      
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
      difficulty,
      progress: 0,
      questionSpoken: false,
    }));
    
    toast({
      title: "Interview Started",
      description: `Your ${difficulty} difficulty ${category} interview has begun. Good luck!`,
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
      console.log("Using OpenAI for answer analysis");
      
      const result = await analyzeInterviewResponse(
        question,
        answer,
        apiKey,
        {
          skillLevel: interviewState.currentSkillLevel as 'beginner' | 'intermediate' | 'expert',
          jobRole: interviewState.category
        }
      );
      
      // Update current skill level based on the analysis
      if (result.skillLevel) {
        setInterviewState(prev => ({
          ...prev,
          currentSkillLevel: result.skillLevel
        }));
      }
      
      // Structure feedback in the expected format
      const feedback = {
        STRENGTHS: result.strengths.join('\n- '),
        WEAKNESSES: result.weaknesses.join('\n- '),
        "KEY POINTS MISSED": result.missedPoints.join('\n- '),
        "IMPROVEMENT SUGGESTIONS": result.improvementTips.join('\n- ')
      };
      
      return {
        feedback,
        improvedAnswer: result.improvedAnswer
      };
    } catch (error) {
      console.error("Error with OpenAI analysis:", error);
      throw error;
    }
  };

  const analyzeAnswerWithGoogleAI = async (question: string, answer: string): Promise<{ feedback: string | any; improvedAnswer: string }> => {
    try {
      console.log("Using Google AI for answer analysis");
      
      // First, generate detailed feedback
      const feedbackPrompt = `You are an expert interview coach analyzing a candidate's response to this interview question: "${question}".

Their answer was: "${answer}"

Please provide detailed, actionable feedback in the following format:
1. STRENGTHS: What specific parts of the answer were effective.
2. WEAKNESSES: What areas need improvement.
3. KEY POINTS MISSED: Important points or concepts that should have been included.
4. IMPROVEMENT SUGGESTIONS: Concrete, actionable tips to make the answer stronger.

Provide thorough, specific feedback for each category. Your goal is to help this candidate significantly improve their interview skills. Return your response in JSON format with these four categories.`;

      const feedbackResponse = await callGoogleAI(feedbackPrompt);
      
      // Parse feedback response
      let feedback;
      try {
        const jsonMatch = feedbackResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          feedback = JSON.parse(jsonMatch[0]);
        } else {
          // If not valid JSON, create a structured format 
          const sections = feedbackResponse.split(/STRENGTHS:|WEAKNESSES:|KEY POINTS MISSED:|IMPROVEMENT SUGGESTIONS:/).filter(s => s.trim().length > 0);
          feedback = {
            STRENGTHS: sections[0] || "Good attempt at answering the question.",
            WEAKNESSES: sections[1] || "Could be more comprehensive with specific examples.",
            "KEY POINTS MISSED": sections[2] || "Consider addressing the core requirements of the question more directly.",
            "IMPROVEMENT SUGGESTIONS": sections[3] || "Structure your answer using the STAR method for clarity."
          };
        }
      } catch (error) {
        console.error("Error parsing feedback:", error);
        feedback = {
          STRENGTHS: "You provided a response to the question.",
          WEAKNESSES: "Your response could be more structured and comprehensive.",
          "KEY POINTS MISSED": "Consider addressing the key elements of the question more directly.",
          "IMPROVEMENT SUGGESTIONS": "Use the STAR method (Situation, Task, Action, Result) for structured responses."
        };
      }
      
      // Next, generate an improved answer
      const improvedAnswerPrompt = `As an expert interviewer, rewrite and significantly improve this candidate's answer to the question: "${question}".

Original answer: "${answer}"

Weaknesses identified: ${feedback.WEAKNESSES}
Key points missed: ${feedback["KEY POINTS MISSED"]}

Create a model answer that would impress a hiring manager. Make it realistic, professional, and include specific examples. The answer should demonstrate strong communication skills and thoughtfully address all aspects of the question. The improved answer should sound natural and conversational, not scripted.`;

      const improvedAnswer = await callGoogleAI(improvedAnswerPrompt);
      
      return {
        feedback,
        improvedAnswer
      };
    } catch (error) {
      console.error("Error with Google AI analysis:", error);
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
      
      // Use OpenAI first if API key is provided and option is enabled
      if (apiKey && interviewState.isUsingOpenAI) {
        try {
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
          console.error("Error with OpenAI evaluation, falling back to Google AI:", error);
        }
      }
      
      // Try Google AI next
      try {
        const { feedback, improvedAnswer } = await analyzeAnswerWithGoogleAI(currentQuestion, answer);
        
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
        console.error("Error with Google AI evaluation, falling back to simple evaluation:", error);
        // Continue to fallback
      }
    } catch (error) {
      console.error("Error in simulateEvaluation:", error);
      return "Sorry, there was an error evaluating your answer. Please try again.";
    }
  }, [interviewState.allQuestions, interviewState.currentQuestionIndex, apiKey, interviewState.isUsingOpenAI]);

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
