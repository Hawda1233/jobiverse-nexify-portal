
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInterview } from "@/contexts/InterviewContext";
import { Mic, Send, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

const VirtualInterviewer: React.FC = () => {
  const {
    interviewState,
    startInterview,
    nextQuestion,
    previousQuestion,
    saveAnswer,
    simulateEvaluation,
    resetInterview,
  } = useInterview();

  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");

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

  if (!interviewState.isStarted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Virtual Interview Simulator</CardTitle>
          <CardDescription>
            Practice your interview skills with our AI-powered interviewer. 
            You'll be asked a series of common interview questions, and receive feedback on your responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This simulator will ask you {interviewState.allQuestions.length} questions commonly asked in job interviews.
            Try to answer as if you were in a real interview!
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={startInterview} className="w-full">
            Start Interview
          </Button>
        </CardFooter>
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
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Overall Feedback:</h3>
            <p>{interviewState.overallFeedback}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Question By Question Review:</h3>
            {interviewState.allQuestions.map((question, index) => (
              interviewState.feedback[index] && (
                <div key={index} className="border-b pb-3">
                  <p className="font-medium">Q: {question}</p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    A: {interviewState.answers[index]?.substring(0, 100)}
                    {interviewState.answers[index]?.length > 100 ? "..." : ""}
                  </p>
                  <p className="text-sm mt-2">Feedback: {interviewState.feedback[index]}</p>
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
            <CardTitle>Interview Question {interviewState.currentQuestionIndex + 1}/{interviewState.allQuestions.length}</CardTitle>
            <CardDescription>Answer as if you were in a real interview</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4 mr-1" /> Restart
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Interviewer:</h3>
          <p>{interviewState.currentQuestion}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Your Answer:</h3>
          <Textarea 
            placeholder="Type your answer here..." 
            className="min-h-[150px]"
            value={answer}
            onChange={handleAnswerChange}
            disabled={isEvaluating}
          />
        </div>
        
        {currentFeedback && (
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium mb-2">Feedback:</h3>
            <p>{currentFeedback}</p>
          </div>
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
