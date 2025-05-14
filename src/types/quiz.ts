
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  name: string;
  category: CategoryType;
}

export type CategoryType = 'aptitude' | 'programming' | 'dsa' | 'reasoning';

export interface QuizSettings {
  selectedTopics: Topic[];
  timePerQuestion: number;
  difficulty: Difficulty;
  numberOfQuestions: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  explanation: string;
  difficulty: Difficulty;
  category: CategoryType; 
  topic: string;
  templateId?: string; // Added to track unique templates and prevent repetition
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  isSkipped: boolean;
  timeTaken: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  skippedQuestions: number;
  totalTimeTaken: number;
  answers: QuizAnswer[];
  quizSettings: QuizSettings;
  questions: QuizQuestion[];
}
