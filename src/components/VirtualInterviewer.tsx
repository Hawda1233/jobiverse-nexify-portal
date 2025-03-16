import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInterview } from "@/contexts/InterviewContext";
import { Mic, MicOff, Send, ArrowRight, ArrowLeft, RotateCcw, Volume2, VolumeX, Video, VideoOff, Loader2, ThumbsUp, ThumbsDown, Award, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import AIInterviewerAvatar from "./AIInterviewerAvatar";

interface VirtualInterviewerProps {
  topic?: string;
  onReset?: () => void;
}

const VirtualInterviewer: React.FC<VirtualInterviewerProps> = ({ topic = "general", onReset }) => {
  const {
    interviewState,
    startInterview,
    nextQuestion,
    previousQuestion,
    saveAnswer,
    simulateEvaluation,
    resetInterview,
    startVoiceRecognition,
    stopVoiceRecognition,
    speakText,
    stopSpeaking,
    generateFollowUpQuestion,
  } = useInterview();

  const [answer, setAnswer] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [showImprovedAnswer, setShowImprovedAnswer] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastTranscriptionLength, setLastTranscriptionLength] = useState(0);

  useEffect(() => {
    if (!interviewState.isStarted) {
      startInterview(topic);
    }
  }, [interviewState.isStarted, startInterview, topic]);

  useEffect(() => {
    if (interviewState.transcription) {
      setAnswer(interviewState.transcription);
      
      if (interviewState.transcription.length > lastTranscriptionLength) {
        setLastTranscriptionLength(interviewState.transcription.length);
        
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
        
        const timer = setTimeout(() => {
          if (interviewState.isListening && interviewState.transcription.length >= 30) {
            handleSubmitAnswer();
          }
        }, 2000);
        
        setSilenceTimer(timer);
      }
    }
    
    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
    };
  }, [interviewState.transcription, lastTranscriptionLength]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    saveAnswer(answer);
    setShowImprovedAnswer(false);
    
    try {
      const feedback = await simulateEvaluation(answer);
      setCurrentFeedback(feedback);
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setCurrentFeedback("Sorry, there was an error evaluating your answer.");
    } finally {
      stopVoiceRecognition();
    }
  };

  const handleNextQuestion = () => {
    setAnswer("");
    setCurrentFeedback("");
    setShowImprovedAnswer(false);
    setLastTranscriptionLength(0);
    nextQuestion();
  };
  
  const handleFollowUpQuestion = async () => {
    if (interviewState.isGeneratingQuestion) return;
    
    try {
      setAnswer("");
      setCurrentFeedback("");
      setShowImprovedAnswer(false);
      setLastTranscriptionLength(0);
      await generateFollowUpQuestion(interviewState.answers[interviewState.currentQuestionIndex] || "");
    } catch (error) {
      console.error("Error generating follow-up:", error);
      handleNextQuestion();
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentFeedback("");
    setShowImprovedAnswer(false);
    setLastTranscriptionLength(0);
    
    const prevAnswer = interviewState.answers[interviewState.currentQuestionIndex - 1] || "";
    setAnswer(prevAnswer);
    
    previousQuestion();
  };

  const handleRestart = () => {
    setAnswer("");
    setCurrentFeedback("");
    setShowImprovedAnswer(false);
    setLastTranscriptionLength(0);
    resetInterview();
    
    if (onReset) {
      onReset();
    }
  };
  
  const handleToggleMicrophone = async () => {
    if (interviewState.isListening) {
      stopVoiceRecognition();
    } else {
      await startVoiceRecognition();
      setLastTranscriptionLength(0);
    }
  };
  
  const handleToggleSpeech = () => {
    if (interviewState.isSpeaking) {
      stopSpeaking();
    } else {
      speakText(interviewState.currentQuestion);
    }
    setAutoPlay(!autoPlay);
  };
  
  const toggleImprovedAnswer = () => {
    setShowImprovedAnswer(!showImprovedAnswer);
  };
  
  useEffect(() => {
    if (interviewState.isListening && interviewState.answers[interviewState.currentQuestionIndex]) {
      setAnswer(interviewState.answers[interviewState.currentQuestionIndex]);
    }
  }, [interviewState.isListening, interviewState.answers, interviewState.currentQuestionIndex]);
  
  useEffect(() => {
    if (autoPlay && interviewState.currentQuestion && !interviewState.isSpeaking && !interviewState.questionSpoken) {
      speakText(interviewState.currentQuestion);
    }
  }, [interviewState.currentQuestion, autoPlay, speakText, interviewState.isSpeaking, interviewState.questionSpoken]);
  
  if (!interviewState.isStarted) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-background/95 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Preparing Your Interview</CardTitle>
          <CardDescription>
            Using AI to generate personalized interview questions...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground text-center max-w-sm">
            Our AI is preparing challenging questions tailored to your selected topic. This may take a moment...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (interviewState.isFinished) {
    return (
      <Card className="w-full max-w-3xl mx-auto bg-background/95 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Interview Complete</CardTitle>
          <CardDescription>
            Thank you for completing the interview simulation!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold mb-2">{interviewState.score}/100</div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
          
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Performance</span>
              <span>{interviewState.score}%</span>
            </div>
            <Progress value={interviewState.score} className="h-2" />
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Overall Feedback:</h3>
            <p>{interviewState.overallFeedback}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Question By Question Review:</h3>
            {interviewState.allQuestions.map((question, index) => (
              interviewState.feedback[index] && (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <p className="font-medium">Q: {question}</p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    A: {interviewState.answers[index]?.substring(0, 100)}
                    {interviewState.answers[index]?.length > 100 ? "..." : ""}
                  </p>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium">Feedback:</p>
                    <p className="text-sm">{interviewState.feedback[index]}</p>
                  </div>
                  {interviewState.improvedAnswers[index] && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-medium">Improved Answer:</p>
                      <p className="text-sm">{interviewState.improvedAnswers[index]}</p>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={handleRestart} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          {onReset && (
            <Button variant="outline" onClick={onReset} className="w-full">
              Choose New Setup
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
      <div className="md:w-1/3">
        <div className="sticky top-4">
          <Card className="bg-background/95 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-sm text-muted-foreground">Video Interview</CardTitle>
                </div>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={handleToggleSpeech}
                        >
                          {interviewState.isSpeaking || autoPlay ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {interviewState.isSpeaking || autoPlay ? "Mute audio" : "Unmute audio"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                        >
                          <Video className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Video is on
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AIInterviewerAvatar 
                isSpeaking={interviewState.isSpeaking} 
                isListening={interviewState.isListening} 
              />

              <div className="mt-4 relative rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 aspect-video w-full max-w-[280px] md:max-w-[320px] mx-auto shadow-lg border border-gray-700">
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                  <div className="bg-gray-900 rounded-full h-24 w-24 flex items-center justify-center">
                    <motion.div
                      animate={interviewState.isListening ? "active" : "inactive"}
                      variants={{
                        inactive: {
                          scale: 1,
                          opacity: 0.7,
                        },
                        active: {
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 1, 0.7],
                          transition: {
                            repeat: Infinity,
                            duration: 1.5,
                          },
                        },
                      }}
                    >
                      <div className="text-xl text-gray-400">You</div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="absolute bottom-3 left-3 flex space-x-2">
                  <div className="bg-black/50 p-1.5 rounded-full">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-black/50 p-1.5 rounded-full">
                    {interviewState.isListening ? (
                      <Mic className="h-4 w-4 text-white" />
                    ) : (
                      <MicOff className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="md:w-2/3">
        <Card className="bg-background/95 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Question {interviewState.currentQuestionIndex + 1}/{interviewState.allQuestions.length}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {interviewState.category.charAt(0).toUpperCase() + interviewState.category.slice(1)}
                  </Badge>
                </div>
                <CardDescription>Answer as if you were in a real interview</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RotateCcw className="h-4 w-4 mr-1" /> Restart
              </Button>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{interviewState.progress}%</span>
              </div>
              <Progress value={interviewState.progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={interviewState.currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-muted rounded-lg"
              >
                {interviewState.isGeneratingQuestion ? (
                  <div className="flex flex-col items-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Generating follow-up question...</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium mb-2">
                      {interviewState.selectedCharacter.name}:
                    </h3>
                    <p>{interviewState.currentQuestion}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Your Answer:</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={interviewState.isListening ? "default" : "outline"} 
                        size="sm"
                        onClick={handleToggleMicrophone}
                        disabled={interviewState.isAnalyzing || interviewState.isGeneratingQuestion || currentFeedback !== ""}
                        className={interviewState.isListening ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        {interviewState.isListening ? (
                          <><MicOff className="h-4 w-4 mr-1" /> Stop Recording</>
                        ) : (
                          <><Mic className="h-4 w-4 mr-1" /> Start Recording</>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {interviewState.isListening ? "Stop voice input" : "Start voice input"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Textarea 
                placeholder={interviewState.isGeneratingQuestion ? "Wait for the follow-up question..." : "Type your answer here or use the microphone above..."} 
                className="min-h-[150px]"
                value={answer}
                onChange={handleAnswerChange}
                disabled={interviewState.isAnalyzing || interviewState.isListening || interviewState.isGeneratingQuestion}
              />
              
              {interviewState.isListening && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Listening... {interviewState.transcription ? "(speech detected)" : "(waiting for speech)"}</p>
                  <p className="text-xs mt-1">Speak clearly and the answer will be submitted automatically after you finish.</p>
                </div>
              )}
            </div>
            
            {interviewState.isAnalyzing && (
              <div className="p-4 bg-background border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p>AI is analyzing your answer...</p>
                </div>
              </div>
            )}
            
            {currentFeedback && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-background border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium mb-2">Feedback:</h3>
                    {interviewState.improvedAnswers[interviewState.currentQuestionIndex] && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleImprovedAnswer}
                        className="mb-2"
                      >
                        {showImprovedAnswer ? "Hide Improved Answer" : "Show Improved Answer"}
                      </Button>
                    )}
                  </div>
                  
                  {typeof currentFeedback === 'string' ? (
                    <p>{currentFeedback}</p>
                  ) : (
                    <div className="space-y-3">
                      {currentFeedback.STRENGTHS && (
                        <div>
                          <h4 className="text-sm font-medium flex items-center text-green-500">
                            <ThumbsUp className="h-4 w-4 mr-1" /> Strengths
                          </h4>
                          <p className="text-sm">{currentFeedback.STRENGTHS}</p>
                        </div>
                      )}
                      
                      {currentFeedback.WEAKNESSES && (
                        <div>
                          <h4 className="text-sm font-medium flex items-center text-amber-500">
                            <ThumbsDown className="h-4 w-4 mr-1" /> Areas for Improvement
                          </h4>
                          <p className="text-sm">{currentFeedback.WEAKNESSES}</p>
                        </div>
                      )}
                      
                      {currentFeedback["KEY POINTS MISSED"] && (
                        <div>
                          <h4 className="text-sm font-medium flex items-center text-blue-500">
                            <Award className="h-4 w-4 mr-1" /> Key Points Missed
                          </h4>
                          <p className="text-sm">{currentFeedback["KEY POINTS MISSED"]}</p>
                        </div>
                      )}
                      
                      {currentFeedback["IMPROVEMENT SUGGESTIONS"] && (
                        <div>
                          <h4 className="text-sm font-medium flex items-center text-purple-500">
                            <Check className="h-4 w-4 mr-1" /> Improvement Tips
                          </h4>
                          <p className="text-sm">{currentFeedback["IMPROVEMENT SUGGESTIONS"]}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {showImprovedAnswer && interviewState.improvedAnswers[interviewState.currentQuestionIndex] && (
                    <div className="mt-4 pt-2 border-t">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-1 text-yellow-500" /> 
                        Improved Answer:
                      </h3>
                      <p className="p-3 bg-muted/50 rounded-md text-sm">
                        {interviewState.improvedAnswers[interviewState.currentQuestionIndex]}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={interviewState.currentQuestionIndex === 0 || interviewState.isAnalyzing || interviewState.isGeneratingQuestion}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              {currentFeedback ? (
                <div className="flex gap-2">
                  {interviewState.followUpMode && interviewState.currentQuestionIndex < interviewState.allQuestions.length - 1 && (
                    <Button 
                      onClick={handleFollowUpQuestion}
                      disabled={interviewState.isAnalyzing || interviewState.isGeneratingQuestion}
                      variant="secondary"
                    >
                      Ask Follow-Up
                      {interviewState.isGeneratingQuestion && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                  )}
                  <Button 
                    onClick={handleNextQuestion} 
                    disabled={interviewState.isAnalyzing || interviewState.isGeneratingQuestion}
                  >
                    {interviewState.currentQuestionIndex === interviewState.allQuestions.length - 1 
                      ? "Finish Interview" 
                      : "Next Question"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleSubmitAnswer} 
                  disabled={!answer.trim() || interviewState.isAnalyzing || interviewState.isGeneratingQuestion}
                >
                  {interviewState.isAnalyzing ? "Analyzing..." : "Submit Answer"} 
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VirtualInterviewer;
