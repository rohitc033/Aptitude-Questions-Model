
import { QuizQuestion, QuizSettings, Topic } from "../types/quiz";
import { questions } from "../data/questions";

export const getRandomQuestions = (settings: QuizSettings, count: number = 10): QuizQuestion[] => {
  // Filter questions based on selected topics and difficulty
  const topicIds = settings.selectedTopics.map(topic => topic.id);
  
  const filteredQuestions = questions.filter(
    q => topicIds.includes(q.topic) && q.difficulty === settings.difficulty
  );

  // If not enough questions available, fallback to any difficulty
  let availableQuestions = filteredQuestions.length >= count 
    ? filteredQuestions 
    : questions.filter(q => topicIds.includes(q.topic));

  // Shuffle and pick random questions
  return shuffleArray(availableQuestions).slice(0, count);
};

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimeInWords = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  let result = "";
  
  if (mins > 0) {
    result += `${mins} minute${mins !== 1 ? 's' : ''}`;
  }
  
  if (secs > 0) {
    if (result) result += " and ";
    result += `${secs} second${secs !== 1 ? 's' : ''}`;
  }
  
  return result || "0 seconds";
};

// Calculate quiz statistics
export const calculateAccuracy = (correct: number, total: number): number => {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

export const calculateScore = (correct: number, total: number): number => {
  return total > 0 ? Math.round((correct / total) * 10) : 0; // Score out of 10
};
