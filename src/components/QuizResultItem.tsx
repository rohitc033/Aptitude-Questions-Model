
import { useState } from "react";
import { QuizQuestion, QuizAnswer } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Timer, BookOpen, Check, X, HelpCircle } from "lucide-react";

interface QuizResultItemProps {
  question: QuizQuestion;
  answer: QuizAnswer;
  index: number;
}

const QuizResultItem = ({ question, answer, index }: QuizResultItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Guard clause to prevent rendering if question is undefined
  if (!question || !question.options) {
    console.error(`Missing question or question options for answer ${answer.questionId}`);
    return (
      <div className="border rounded-lg mb-4 p-4 bg-red-50">
        <p className="text-red-500">Error: Question data is missing</p>
      </div>
    );
  }
  
  const selectedOption = question.options.find(o => o.id === answer.selectedOptionId);
  const correctOption = question.options.find(o => o.isCorrect);
  
  const getStatusBadgeClass = () => {
    if (answer.isSkipped) return "bg-gray-100 text-gray-800";
    return answer.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
  
  const getStatusIcon = () => {
    if (answer.isSkipped) return <HelpCircle className="h-4 w-4 mr-1" />;
    return answer.isCorrect ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />;
  };
  
  const getStatusText = () => {
    if (answer.isSkipped) return "Skipped";
    return answer.isCorrect ? "Correct" : "Incorrect";
  };
  
  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">{index + 1}.</span>
              <h3 className="font-medium text-gray-900">{question.text}</h3>
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusBadgeClass()}`}>
                {getStatusIcon()}
                {getStatusText()}
              </span>
              {!answer.isSkipped && (
                <span className="text-sm text-gray-500">
                  Your answer: {selectedOption?.text || "None"}
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="ml-2 whitespace-nowrap"
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </Button>
        </div>
        
        {answer.timeTaken && (
          <div className="mt-2 text-sm text-gray-500 flex items-center">
            <Timer className="h-4 w-4 mr-1" /> Time taken: {answer.timeTaken} seconds
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="mb-4">
            <h4 className="font-medium mb-1 flex items-center">
              <Check className="h-4 w-4 text-green-600 mr-1" /> Correct Answer
            </h4>
            <p className="text-green-700">{correctOption?.text}</p>
          </div>
          <div>
            <h4 className="font-medium mb-1 flex items-center">
              <BookOpen className="h-4 w-4 text-blue-600 mr-1" /> Explanation
            </h4>
            <div className="text-gray-700 bg-white p-4 rounded-md border">
              {question.explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResultItem;
