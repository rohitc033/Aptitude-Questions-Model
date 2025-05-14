
import { useLocation, useNavigate } from "react-router-dom";
import { QuizResult } from "@/types/quiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizResultItem from "@/components/QuizResultItem";
import { calculateAccuracy, formatTimeInWords } from "@/utils/quizUtils";
import Header from "@/components/Header";
import { Award, BookOpen, AlertCircle, Clock, BarChart } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizResult = location.state?.result as QuizResult;
  
  if (!quizResult) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg text-center p-6">
            <CardHeader>
              <CardTitle>Results Not Available</CardTitle>
              <CardDescription>No quiz results found. Please take a quiz first.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button onClick={() => navigate("/")} className="bg-quiz-primary hover:bg-quiz-secondary">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  const { 
    totalQuestions, 
    correctAnswers, 
    skippedQuestions, 
    totalTimeTaken,
    answers,
    questions,
    quizSettings
  } = quizResult;
  
  // Make sure we have questions and answers data
  if (!questions || !answers || questions.length === 0 || answers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg text-center p-6">
            <CardHeader>
              <CardTitle>Invalid Quiz Results</CardTitle>
              <CardDescription>The quiz results data is incomplete or invalid.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button onClick={() => navigate("/")} className="bg-quiz-primary hover:bg-quiz-secondary">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  const accuracy = calculateAccuracy(correctAnswers, totalQuestions);
  const attemptedQuestions = totalQuestions - skippedQuestions;
  
  const handleRetakeQuiz = () => {
    navigate("/quiz", { state: { quizSettings } });
  };
  
  const handleNewQuiz = () => {
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1 text-quiz-primary">Career Catalyst</h1>
          <h2 className="text-2xl font-semibold mb-6">Your Quiz Results</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-quiz-primary text-4xl font-bold flex items-center justify-center">
                <Award className="h-8 w-8 mr-2 text-yellow-500" />
                {correctAnswers}/{totalQuestions}
              </CardTitle>
              <CardDescription className="text-center">Score</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-quiz-primary text-4xl font-bold flex items-center justify-center">
                <BarChart className="h-8 w-8 mr-2 text-blue-500" />
                {accuracy}%
              </CardTitle>
              <CardDescription className="text-center">Accuracy</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-quiz-primary text-4xl font-bold flex items-center justify-center">
                <Clock className="h-8 w-8 mr-2 text-green-500" />
                {formatTimeInWords(totalTimeTaken)}
              </CardTitle>
              <CardDescription className="text-center">Time Taken</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" /> Quiz Summary
            </CardTitle>
            <CardDescription>Detailed breakdown of your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="font-semibold">{totalQuestions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Attempted</p>
                <p className="font-semibold">{attemptedQuestions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Correct</p>
                <p className="font-semibold text-green-600">{correctAnswers}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Skipped</p>
                <p className="font-semibold text-gray-600">{skippedQuestions}</p>
              </div>
            </div>
            
            {skippedQuestions > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <p className="text-yellow-700">
                    You skipped {skippedQuestions} question{skippedQuestions > 1 ? 's' : ''}.
                    Review them below to see the correct answers.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" /> Question Analysis
            </CardTitle>
            <CardDescription>Review your answers and learn from explanations</CardDescription>
          </CardHeader>
          <CardContent>
            {answers.map((answer, index) => {
              // Ensure we have the matching question for this answer
              const question = questions.find(q => q.id === answer.questionId);
              
              // Only render the component if we have both question and answer
              return question ? (
                <QuizResultItem 
                  key={answer.questionId}
                  question={question}
                  answer={answer}
                  index={index}
                />
              ) : (
                <div key={`missing-${index}`} className="border rounded-lg mb-4 p-4 bg-red-50">
                  <p className="text-red-500">Error: Question data is missing for answer {index + 1}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button 
            onClick={handleRetakeQuiz} 
            className="bg-quiz-primary hover:bg-quiz-secondary"
          >
            Take Quiz Again
          </Button>
          <Button 
            onClick={handleNewQuiz} 
            variant="outline"
          >
            New Quiz
          </Button>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 Career Catalyst. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Results;
