
import { QuizQuestion, CategoryType } from "@/types/quiz";

export const topics = {
  aptitude: [
    // Number Systems & Algebra
    {
      id: "aptitude-1",
      name: "Number System",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-2",
      name: "Percentage",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-3",
      name: "Ratio & Proportion",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-4",
      name: "Algebra",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-5",
      name: "Progressions",
      category: "aptitude" as CategoryType
    },
    
    // Measurement
    {
      id: "aptitude-6",
      name: "Time, Speed & Distance",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-7",
      name: "Work & Time",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-8",
      name: "Mensuration",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-9",
      name: "Geometry",
      category: "aptitude" as CategoryType
    },
    
    // Data Analysis
    {
      id: "aptitude-10",
      name: "Probability",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-11", 
      name: "Permutation & Combination",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-12", 
      name: "Statistics",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-13", 
      name: "Data Interpretation",
      category: "aptitude" as CategoryType
    },
    
    // Reasoning
    {
      id: "aptitude-14", 
      name: "Reasoning",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-15", 
      name: "Logical Series",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-16", 
      name: "Coding-Decoding",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-17", 
      name: "Blood Relations",
      category: "aptitude" as CategoryType
    },
    
    // Finance
    {
      id: "aptitude-18", 
      name: "Simple Interest",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-19", 
      name: "Compound Interest",
      category: "aptitude" as CategoryType
    },
    {
      id: "aptitude-20", 
      name: "Profit & Loss",
      category: "aptitude" as CategoryType
    }
  ],
  programming: [
    {
      id: "programming-1",
      name: "Java",
      category: "programming" as CategoryType
    },
    {
      id: "programming-2",
      name: "Python",
      category: "programming" as CategoryType
    },
    {
      id: "programming-3",
      name: "JavaScript",
      category: "programming" as CategoryType
    },
    {
      id: "programming-4",
      name: "C++",
      category: "programming" as CategoryType
    },
    {
      id: "programming-5",
      name: "C#",
      category: "programming" as CategoryType
    },
    {
      id: "programming-6",
      name: "Go",
      category: "programming" as CategoryType
    }
  ],
  dsa: [
    {
      id: "dsa-1",
      name: "Arrays",
      category: "dsa" as CategoryType
    },
    {
      id: "dsa-2",
      name: "Linked Lists",
      category: "dsa" as CategoryType
    },
    {
      id: "dsa-3",
      name: "Trees",
      category: "dsa" as CategoryType
    },
    {
      id: "dsa-4",
      name: "Graphs",
      category: "dsa" as CategoryType
    },
    {
      id: "dsa-5",
      name: "Sorting Algorithms",
      category: "dsa" as CategoryType
    },
    {
      id: "dsa-6",
      name: "Searching Algorithms",
      category: "dsa" as CategoryType
    },
    {
      id: "dsa-7",
      name: "Hash Tables",
      category: "dsa" as CategoryType
    }
  ],
  reasoning: [
    {
      id: "reasoning-1",
      name: "Verbal Analogies",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-2",
      name: "Syllogisms",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-3",
      name: "Logical Deduction",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-4",
      name: "Pattern Recognition",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-5",
      name: "Matrices",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-6",
      name: "Critical Thinking",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-7",
      name: "Situational Judgement",
      category: "reasoning" as CategoryType
    },
    {
      id: "reasoning-8",
      name: "Statement & Conclusion",
      category: "reasoning" as CategoryType
    }
  ]
};

export const questions: QuizQuestion[] = [
  {
    id: "1",
    text: "What is the capital of France?",
    options: [
      { id: "1a", text: "Berlin", isCorrect: false },
      { id: "1b", text: "Paris", isCorrect: true },
      { id: "1c", text: "Madrid", isCorrect: false },
      { id: "1d", text: "Rome", isCorrect: false },
    ],
    explanation: "Paris is the capital and most populous city of France.",
    difficulty: "easy",
    category: "aptitude", // Changed from "general" to "aptitude" to match CategoryType
    topic: "general-knowledge"
  },
  {
    id: "2",
    text: "Which data structure follows the LIFO (Last In, First Out) principle?",
    options: [
      { id: "2a", text: "Queue", isCorrect: false },
      { id: "2b", text: "Stack", isCorrect: true },
      { id: "2c", text: "Linked List", isCorrect: false },
      { id: "2d", text: "Tree", isCorrect: false },
    ],
    explanation: "A stack follows the LIFO principle, where the last element added is the first one to be removed.",
    difficulty: "medium",
    category: "dsa",
    topic: "stack"
  },
  {
    id: "3",
    text: "What is the time complexity of searching an element in a sorted array using binary search?",
    options: [
      { id: "3a", text: "O(n)", isCorrect: false },
      { id: "3b", text: "O(log n)", isCorrect: true },
      { id: "3c", text: "O(n^2)", isCorrect: false },
      { id: "3d", text: "O(1)", isCorrect: false },
    ],
    explanation: "Binary search has a time complexity of O(log n) because it halves the search space with each step.",
    difficulty: "medium",
    category: "dsa",
    topic: "searching-algorithms"
  },
  {
    id: "4",
    text: "Which of the following is NOT a feature of object-oriented programming?",
    options: [
      { id: "4a", text: "Inheritance", isCorrect: false },
      { id: "4b", text: "Polymorphism", isCorrect: false },
      { id: "4c", text: "Encapsulation", isCorrect: false },
      { id: "4d", text: "Pointers", isCorrect: true },
    ],
    explanation: "Pointers are not a feature of object-oriented programming, but rather a concept from lower-level languages like C and C++.",
    difficulty: "medium",
    category: "programming",
    topic: "oop"
  },
  {
    id: "5",
    text: "What is the value of x? 2x + 5 = 15",
    options: [
      { id: "5a", text: "5", isCorrect: true },
      { id: "5b", text: "10", isCorrect: false },
      { id: "5c", text: "20", isCorrect: false },
      { id: "5d", text: "25", isCorrect: false },
    ],
    explanation: "To solve for x, subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5.",
    difficulty: "easy",
    category: "aptitude",
    topic: "number-system"
  },
  {
    id: "6",
    text: "If a train travels 120 miles in 2 hours, what is its average speed?",
    options: [
      { id: "6a", text: "40 mph", isCorrect: false },
      { id: "6b", text: "60 mph", isCorrect: true },
      { id: "6c", text: "80 mph", isCorrect: false },
      { id: "6d", text: "100 mph", isCorrect: false },
    ],
    explanation: "Average speed is calculated by dividing the total distance by the total time. So, 120 miles / 2 hours = 60 mph.",
    difficulty: "easy",
    category: "aptitude",
    topic: "time-speed-distance"
  },
  {
    id: "7",
    text: "A shopkeeper marks an item 20% above its cost price. If he offers a discount of 10% on the marked price, what is his profit percentage?",
    options: [
      { id: "7a", text: "10%", isCorrect: false },
      { id: "7b", text: "8%", isCorrect: true },
      { id: "7c", text: "12%", isCorrect: false },
      { id: "7d", text: "15%", isCorrect: false },
    ],
    explanation: "Let the cost price be $100. The marked price is $120. After a 10% discount, the selling price is $108. The profit percentage is ($108 - $100) / $100 * 100 = 8%.",
    difficulty: "medium",
    category: "aptitude",
    topic: "percentage"
  },
  {
    id: "8",
    text: "If A can do a piece of work in 10 days and B can do the same work in 15 days, how many days will they take to complete the work together?",
    options: [
      { id: "8a", text: "5 days", isCorrect: false },
      { id: "8b", text: "6 days", isCorrect: true },
      { id: "8c", text: "8 days", isCorrect: false },
      { id: "8d", text: "12 days", isCorrect: false },
    ],
    explanation: "A's one day work = 1/10, B's one day work = 1/15. Together they complete (1/10 + 1/15) = (3+2)/30 = 5/30 = 1/6 of the work in one day. So they'll complete the entire work in 6 days.",
    difficulty: "medium",
    category: "aptitude",
    topic: "work-time"
  },
  {
    id: "9",
    text: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
    options: [
      { id: "9a", text: "36", isCorrect: false },
      { id: "9b", text: "40", isCorrect: false },
      { id: "9c", text: "42", isCorrect: true },
      { id: "9d", text: "48", isCorrect: false },
    ],
    explanation: "The series follows the pattern n * (n + 1), where n starts from 1. So, the next number is 6 * 7 = 42.",
    difficulty: "medium",
    category: "aptitude",
    topic: "reasoning"
  },
  {
    id: "10",
    text: "If the ratio of boys to girls in a class is 3:5 and there are 24 students in the class, how many girls are there?",
    options: [
      { id: "10a", text: "8", isCorrect: false },
      { id: "10b", text: "15", isCorrect: true },
      { id: "10c", text: "16", isCorrect: false },
      { id: "10d", text: "20", isCorrect: false },
    ],
    explanation: "The total ratio is 3 + 5 = 8. Since there are 24 students, each ratio unit represents 24 / 8 = 3 students. Therefore, the number of girls is 5 * 3 = 15.",
    difficulty: "easy",
    category: "aptitude",
    topic: "ratio-proportion"
  },
];
