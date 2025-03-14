
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInterview } from "@/contexts/InterviewContext";
import { Mic, MicOff, Send, ArrowRight, ArrowLeft, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AnimatePresence, motion } from "framer-motion";

interface VirtualInterviewerProps {
  topic?: string;
}

const VirtualInterviewer: React.FC<VirtualInterviewerProps> = ({ topic = "general" }) => {
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
  } = useInterview();

  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [autoPlay, setAutoPlay] = useState(true);

  // Start the interview when component mounts if it's not already started
  useEffect(() => {
    if (!interviewState.isStarted) {
      startInterview(topic);
    }
  }, [interviewState.isStarted, startInterview, topic]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    saveAnswer(answer);
    setIsEvaluating(true);
    
    try {
      const feedback = await simulateEvaluation(answer);
      setCurrentFeedback(feedback);
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setCurrentFeedback("Sorry, there was an error evaluating your answer.");
    } finally {
      setIsEvaluating(false);
      stopVoiceRecognition();
    }
  };

  const handleNextQuestion = () => {
    setAnswer("");
    setCurrentFeedback("");
    nextQuestion();
  };

  const handlePreviousQuestion = () => {
    setCurrentFeedback("");
    
    // Restore previous answer if it exists
    const prevAnswer = interviewState.answers[interviewState.currentQuestionIndex - 1] || "";
    setAnswer(prevAnswer);
    
    previousQuestion();
  };

  const handleRestart = () => {
    setAnswer("");
    setCurrentFeedback("");
    resetInterview();
  };
  
  const handleToggleMicrophone = async () => {
    if (interviewState.isListening) {
      stopVoiceRecognition();
    } else {
      await startVoiceRecognition();
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
  
  // Auto-update answer when listening
  useEffect(() => {
    if (interviewState.isListening && interviewState.answers[interviewState.currentQuestionIndex]) {
      setAnswer(interviewState.answers[interviewState.currentQuestionIndex]);
    }
  }, [interviewState.isListening, interviewState.answers, interviewState.currentQuestionIndex]);
  
  // Automatically read questions if autoPlay is enabled
  useEffect(() => {
    if (autoPlay && interviewState.currentQuestion && !interviewState.isSpeaking) {
      speakText(interviewState.currentQuestion);
    }
  }, [interviewState.currentQuestion, autoPlay, speakText, interviewState.isSpeaking]);

  if (!interviewState.isStarted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Interview Loading...</CardTitle>
          <CardDescription>
            Preparing your interview questions...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (interviewState.isFinished) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
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
                </div>
              )
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRestart} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Interview Question {interviewState.currentQuestionIndex + 1}/{interviewState.allQuestions.length}</CardTitle>
              <Badge variant="outline" className="ml-2">
                {interviewState.category.charAt(0).toUpperCase() + interviewState.category.slice(1)}
              </Badge>
            </div>
            <CardDescription>Answer as if you were in a real interview</CardDescription>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleToggleSpeech}
                  >
                    {interviewState.isSpeaking || autoPlay ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {interviewState.isSpeaking || autoPlay ? "Turn off voice" : "Turn on voice"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4 mr-1" /> Restart
            </Button>
          </div>
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
            <h3 className="font-medium mb-2">Interviewer:</h3>
            <p>{interviewState.currentQuestion}</p>
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
                    disabled={isEvaluating}
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
            placeholder="Type your answer here or use the microphone above..." 
            className="min-h-[150px]"
            value={answer}
            onChange={handleAnswerChange}
            disabled={isEvaluating}
          />
        </div>
        
        {currentFeedback && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-background border rounded-lg"
            >
              <h3 className="font-medium mb-2">Feedback:</h3>
              <p>{currentFeedback}</p>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handlePreviousQuestion}
            disabled={interviewState.currentQuestionIndex === 0 || isEvaluating}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {currentFeedback ? (
            <Button 
              onClick={handleNextQuestion} 
              disabled={isEvaluating}
            >
              {interviewState.currentQuestionIndex === interviewState.allQuestions.length - 1 
                ? "Finish Interview" 
                : "Next Question"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={!answer.trim() || isEvaluating}
            >
              {isEvaluating ? "Evaluating..." : "Submit Answer"} 
              <Send className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VirtualInterviewer;
