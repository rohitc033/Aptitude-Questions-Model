
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { QuizSettings, Topic, CategoryType } from "@/types/quiz";
import { topics } from "@/data/questions";
import CategorySection from "@/components/CategorySection";
import Header from "@/components/Header";
import { BookOpen, Timer, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("aptitude");
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(60);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  
  const handleTopicChange = (topic: Topic, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTopics([...selectedTopics, topic]);
    } else {
      setSelectedTopics(selectedTopics.filter(t => t.id !== topic.id));
    }
  };
  
  const handleStartQuiz = () => {
    if (selectedTopics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    
    const quizSettings: QuizSettings = {
      selectedTopics,
      timePerQuestion,
      difficulty,
      numberOfQuestions
    };
    
    navigate("/quiz", { state: { quizSettings } });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-quiz-primary">Career Catalyst</h1>
          <p className="text-lg text-gray-600 mb-6">
            Test your knowledge in Aptitude, Programming Languages, and Data Structures & Algorithms
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-quiz-primary" />
            Configure Your Quiz
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-quiz-primary" />
              Select Topics
            </h3>
            
            <Tabs defaultValue="aptitude" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
                <TabsTrigger value="programming">Programming</TabsTrigger>
                <TabsTrigger value="dsa">DSA</TabsTrigger>
              </TabsList>
              
              <TabsContent value="aptitude" className="space-y-4">
                <CategorySection
                  title="Aptitude Topics"
                  topics={topics.aptitude as Topic[]}
                  selectedTopics={selectedTopics}
                  onTopicChange={handleTopicChange}
                />
              </TabsContent>
              
              <TabsContent value="programming" className="space-y-4">
                <CategorySection
                  title="Programming Languages"
                  topics={topics.programming as Topic[]}
                  selectedTopics={selectedTopics}
                  onTopicChange={handleTopicChange}
                />
              </TabsContent>
              
              <TabsContent value="dsa" className="space-y-4">
                <CategorySection
                  title="Data Structures & Algorithms"
                  topics={topics.dsa as Topic[]}
                  selectedTopics={selectedTopics}
                  onTopicChange={handleTopicChange}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Timer className="h-4 w-4 mr-2 text-quiz-primary" />
                Time Per Question
              </h3>
              <Select
                value={timePerQuestion.toString()}
                onValueChange={(value) => setTimePerQuestion(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time per question" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="90">1.5 minutes</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Difficulty Level</h3>
              <RadioGroup value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="difficulty-easy" />
                  <Label htmlFor="difficulty-easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="difficulty-medium" />
                  <Label htmlFor="difficulty-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="difficulty-hard" />
                  <Label htmlFor="difficulty-hard">Hard</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Number of Questions</h3>
            <Select
              value={numberOfQuestions.toString()}
              onValueChange={(value) => setNumberOfQuestions(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 questions</SelectItem>
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="15">15 questions</SelectItem>
                <SelectItem value="20">20 questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleStartQuiz} 
              className="px-8 py-6 text-lg bg-quiz-primary hover:bg-quiz-secondary"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 Career Catalyst. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
