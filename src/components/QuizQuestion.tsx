
import { useState, useEffect } from "react";
import { QuizQuestion as QuizQuestionType, QuizAnswer } from "@/types/quiz";
import QuizOption from "./QuizOption";
import QuizTimer from "./QuizTimer";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: QuizQuestionType;
  timePerQuestion: number;
  onAnswer: (answer: QuizAnswer) => void;
  questionIndex: number;
  totalQuestions: number;
  hideResults?: boolean;
  key?: string; // Added key prop for forcing complete reset
}

const QuizQuestion = ({ 
  question, 
  timePerQuestion, 
  onAnswer, 
  questionIndex, 
  totalQuestions,
  hideResults = false
}: QuizQuestionProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timerKey, setTimerKey] = useState<number>(Date.now()); // Used to force timer reset
  
  // Reset when question changes
  useEffect(() => {
    setSelectedOptionId(null);
    setStartTime(Date.now());
    setIsRevealed(false);
    setIsTimedOut(false);
    setTimerKey(Date.now());
  }, [question.id]);
  
  const handleOptionSelect = (optionId: string) => {
    if (isRevealed || isTimedOut) return;
    setSelectedOptionId(optionId);
  };
  
  const handleSubmitAnswer = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const selectedOption = question.options.find(o => o.id === selectedOptionId);
    
    // Only reveal answer if not hiding results
    if (!hideResults) {
      setIsRevealed(true);
    }
    
    onAnswer({
      questionId: question.id,
      selectedOptionId,
      isCorrect: selectedOption?.isCorrect || false,
      isSkipped: selectedOptionId === null,
      timeTaken: Math.min(timeTaken, timePerQuestion)
    });
  };
  
  const handleTimeout = () => {
    setIsTimedOut(true);
    // Submit the answer as skipped when timer expires
    onAnswer({
      questionId: question.id,
      selectedOptionId: null,
      isCorrect: false,
      isSkipped: true,
      timeTaken: timePerQuestion
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in p-4">
      <div className="text-sm font-medium text-gray-500 mb-2">
        Question {questionIndex + 1} of {totalQuestions}
      </div>
      
      <QuizTimer 
        duration={timePerQuestion} 
        onTimeout={handleTimeout} 
        isActive={!isRevealed && !isTimedOut}
        key={`timer-${question.id}-${timerKey}`} // Force timer reset
      />
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
        
        <div className="space-y-2">
          {question.options.map((option) => (
            <QuizOption
              key={option.id}
              option={option}
              isSelected={selectedOptionId === option.id}
              isRevealed={isRevealed && !hideResults}
              onSelect={() => handleOptionSelect(option.id)}
              disabled={isRevealed || isTimedOut}
            />
          ))}
        </div>
      </div>
      
      {isRevealed && !hideResults && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Explanation</h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{question.explanation}</p>
        </div>
      )}
      
      {isTimedOut && (
        <div className="mb-6">
          <p className="text-amber-600 font-medium">Time's up! Moving to the next question.</p>
        </div>
      )}
      
      <div className="flex justify-between">
        {!isRevealed && !isTimedOut ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleSubmitAnswer}
            >
              Skip
            </Button>
            <Button 
              onClick={handleSubmitAnswer}
              disabled={selectedOptionId === null}
              className="bg-quiz-primary hover:bg-quiz-secondary"
            >
              Next
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleSubmitAnswer}
            className="ml-auto bg-quiz-primary hover:bg-quiz-secondary"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
