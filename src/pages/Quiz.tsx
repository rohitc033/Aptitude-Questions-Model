
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizSettings, QuizQuestion as QuestionType, QuizAnswer, QuizResult } from "@/types/quiz";
import { fetchQuestionsFromGemini } from "@/services/geminiService";
import QuizQuestion from "@/components/QuizQuestion";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Loader } from "lucide-react";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizSettings = location.state?.quizSettings as QuizSettings;
  
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [startTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState<number>(0); // Key to force timer reset
  
  useEffect(() => {
    if (!quizSettings) {
      toast.error("Quiz settings not found. Please configure your quiz.");
      navigate("/");
      return;
    }
    
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const aiQuestions = await fetchQuestionsFromGemini(quizSettings);
        setQuestions(aiQuestions);
        setIsLoading(false);
        
        if (aiQuestions.length < quizSettings.numberOfQuestions) {
          toast.warning(`Only ${aiQuestions.length} questions available for the selected criteria. Continuing with available questions.`);
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
        setError("Failed to load questions. Please try again.");
        setIsLoading(false);
        toast.error("Failed to load questions. Please try again.");
      }
    };
    
    loadQuestions();
  }, [quizSettings, navigate]);
  
  // Reset timer key when moving to a new question
  useEffect(() => {
    setTimerKey(prev => prev + 1);
  }, [currentQuestionIndex]);
  
  const handleAnswer = (answer: QuizAnswer) => {
    // Add answer to state
    setAnswers([...answers, answer]);
    
    // Move to next question or results
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishQuiz(answer);
      }
    }, 300); 
  };
  
  const finishQuiz = (finalAnswer: QuizAnswer) => {
    const totalTimeTaken = Math.round((Date.now() - startTime) / 1000);
    
    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: answers.filter(a => a.isCorrect).length + (finalAnswer.isCorrect ? 1 : 0),
      skippedQuestions: answers.filter(a => a.isSkipped).length + (finalAnswer.isSkipped ? 1 : 0),
      totalTimeTaken,
      answers: [...answers, finalAnswer],
      quizSettings,
      questions
    };
    
    navigate("/results", { state: { result } });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Generating your quiz questions...</h2>
            <div className="flex justify-center mb-4">
              <Loader className="h-8 w-8 animate-spin text-quiz-primary" />
            </div>
            <p className="mt-4 text-gray-500">
              Using AI to create personalized questions for your selected topics.<br />
              This may take a few moments.
            </p>
          </div>
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-red-500">{error}</h2>
            <button 
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-quiz-primary text-white rounded hover:bg-quiz-secondary"
            >
              Return to Home
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">No questions available for the selected criteria.</h2>
            <button 
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-quiz-primary text-white rounded hover:bg-quiz-secondary"
            >
              Try Different Topics
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            timePerQuestion={quizSettings.timePerQuestion}
            onAnswer={handleAnswer}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            hideResults={true}
            key={`question-${currentQuestionIndex}-${timerKey}`} // Force component reset
          />
        </div>
      </main>
    </div>
  );
};

export default Quiz;
