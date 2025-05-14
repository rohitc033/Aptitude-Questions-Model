import { QuizQuestion, QuizSettings, CategoryType } from "@/types/quiz";
import { v4 as uuidv4 } from "uuid";

interface GeminiResponse {
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
    explanation: string;
    topic: string;
    templateId?: string;
  }[];
}

const GEMINI_API_KEY = "AIzaSyDnZUAhHkDBUpc3E18hsVfCwpvyiNN_lY4";

// Tracking used templates to ensure question diversity
const usedTemplateIds = new Set<string>();

export const fetchQuestionsFromGemini = async (quizSettings: QuizSettings): Promise<QuizQuestion[]> => {
  try {
    const { selectedTopics, difficulty, numberOfQuestions } = quizSettings;
    
    // Create a more comprehensive prompt for Gemini API to ensure unique questions
    const topicNames = selectedTopics.map(topic => topic.name).join(", ");
    const timestamp = new Date().toISOString(); // Adding timestamp to ensure uniqueness
    const sessionId = uuidv4(); // Unique session ID for this quiz attempt
    
    // Extract categories for special instructions
    const categories = new Set(selectedTopics.map(topic => topic.category));
    const hasAptitude = categories.has('aptitude');
    const hasReasoning = categories.has('reasoning');
    
    const prompt = `You are QuestionMaster, a specialized quiz-generation AI. 
    Generate ${numberOfQuestions} unique multiple-choice questions for the topics: ${topicNames} at ${difficulty} level.
    Current timestamp: ${timestamp} - Generate brand new questions with unique templates.
    Session ID: ${sessionId}
    
    For each question:
    - Create a clear, grammatically correct question with high diversity.
    - Provide exactly 4 distinct answer options, with only one being correct.
    - Write a detailed explanation that thoroughly explains the solution.
    - Include a unique templateId to prevent repetition within the same topic.
    - For mathematical questions, include step-by-step calculations and formulas.
    - For programming questions, include code explanations or examples where relevant.
    - For reasoning questions, clearly explain the logical framework used to arrive at the answer.
    - Ensure NO duplicate questions or content across this batch.
    - Make each question focused on a specific concept within the topic.
    - Vary the difficulty and complexity within the specified ${difficulty} level.
    
    ${hasAptitude ? `
    For Aptitude questions:
    - Include varied template styles (e.g., direct calculations, word problems, application scenarios)
    - Balance numerical, algebraic, geometric and logical questions
    - Provide clear mathematical working in explanations
    - Cover multiple approaches to solution when relevant
    ` : ''}
    
    ${hasReasoning ? `
    For Reasoning questions:
    - Include diverse question formats (verbal, non-verbal, critical thinking)
    - For verbal reasoning, include analogies, syllogisms, and logical deductions
    - For non-verbal reasoning, include patterns, matrices, and sequence completion
    - Clearly explain the logical principle behind each answer
    ` : ''}
    
    Format the response as JSON with the following structure:
    {
      "questions": [
        {
          "text": "Question text goes here?",
          "options": [
            { "text": "First option", "isCorrect": false },
            { "text": "Second option", "isCorrect": true },
            { "text": "Third option", "isCorrect": false },
            { "text": "Fourth option", "isCorrect": false }
          ],
          "explanation": "Detailed step-by-step explanation with formulas and calculations if applicable",
          "topic": "Specific topic name",
          "templateId": "unique-template-identifier-for-this-question-type"
        }
      ]
    }`;

    console.log("Sending request to Gemini API with prompt:", prompt);
    
    // Make actual API call to Gemini
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.9, // Increased temperature for more variability
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API error:", errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gemini API response:", data);
      
      // Extract the content from Gemini's response
      let jsonContent = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        jsonContent = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
      
      // Parse the JSON content
      // Sometimes Gemini might include markdown code blocks, so we need to clean that up
      jsonContent = jsonContent.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedResponse = JSON.parse(jsonContent) as GeminiResponse;
      console.log("Parsed questions:", parsedResponse.questions);
      
      // Check for duplicate templates and filter them out
      const filteredQuestions = parsedResponse.questions.filter(question => {
        const templateId = question.templateId || `${question.topic}-${question.text.substring(0, 20)}`;
        
        // If this template has been used before, skip it
        if (usedTemplateIds.has(templateId)) {
          console.log(`Skipping duplicate template: ${templateId}`);
          return false;
        }
        
        // Otherwise, mark it as used and keep it
        usedTemplateIds.add(templateId);
        return true;
      });
      
      console.log(`Filtered out ${parsedResponse.questions.length - filteredQuestions.length} duplicate templates`);
      
      // If we filtered too many questions, try to generate more to compensate
      if (filteredQuestions.length < numberOfQuestions * 0.8) {
        console.warn(`Too many duplicate templates filtered. Only ${filteredQuestions.length} unique questions remain.`);
      }
      
      // Transform the response into QuizQuestion format
      return filteredQuestions.map(question => {
        const topic = selectedTopics.find(t => t.name === question.topic) || selectedTopics[0];
        const category = topic.category;
        
        return {
          id: uuidv4(),
          text: question.text,
          options: question.options.map(option => ({
            id: uuidv4(),
            text: option.text,
            isCorrect: option.isCorrect
          })),
          explanation: question.explanation,
          difficulty: difficulty,
          category: category,
          topic: topic.id,
          templateId: question.templateId || `${topic.id}-${uuidv4().slice(0,8)}`
        };
      });
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      console.log("Falling back to mock data");
      
      // Clear used templates for this new attempt
      usedTemplateIds.clear();
      
      // If the API call fails, fall back to the mock data
      const mockResponse = await simulateGeminiAPICall(prompt, selectedTopics, difficulty, numberOfQuestions, sessionId);
      
      // Return mock data processed in the same way
      return mockResponse.questions.map(question => {
        const topic = selectedTopics.find(t => t.name === question.topic) || selectedTopics[0];
        const category = topic.category;
        
        const templateId = question.templateId || `mock-${topic.id}-${uuidv4().slice(0,8)}`;
        
        return {
          id: uuidv4(),
          text: question.text,
          options: question.options.map(option => ({
            id: uuidv4(),
            text: option.text,
            isCorrect: option.isCorrect
          })),
          explanation: question.explanation,
          difficulty: difficulty,
          category: category,
          topic: topic.id,
          templateId: templateId
        };
      });
    }
  } catch (error) {
    console.error("Error fetching questions from Gemini:", error);
    throw new Error("Failed to fetch questions from AI. Please try again.");
  }
};

// Enhanced mock function to simulate Gemini API response with diverse questions
const simulateGeminiAPICall = async (
  prompt: string, 
  selectedTopics: { id: string; name: string; category: CategoryType }[],
  difficulty: string,
  count: number,
  sessionId: string
): Promise<GeminiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const questions: GeminiResponse["questions"] = [];
  const timestamp = new Date().toISOString(); // Add timestamp for variance
  const usedTemplatesInMock = new Set<string>();
  
  // Generate mock questions based on selected topics
  for (let i = 0; i < count; i++) {
    const topicIndex = i % selectedTopics.length;
    const topic = selectedTopics[topicIndex];
    
    // Create different questions based on category
    let questionText = '';
    let options = [];
    let explanation = '';
    let templateId = `${sessionId}-${topic.category}-${topic.id}-template${Math.floor(Math.random() * 10)}`;
    
    // Ensure template uniqueness
    while (usedTemplatesInMock.has(templateId)) {
      templateId = `${sessionId}-${topic.category}-${topic.id}-template${Math.floor(Math.random() * 100)}`;
    }
    usedTemplatesInMock.add(templateId);
    
    if (topic.category === 'aptitude') {
      if (topic.name.includes('Probability')) {
        const randomNum = Math.floor(Math.random() * 6) + 2; // Random number to vary questions
        questionText = `If you roll a fair die ${randomNum} times, what is the probability of getting at least one 6?`;
        options = [
          { text: `1-(5/6)^${randomNum}`, isCorrect: true },
          { text: `(1/6)^${randomNum}`, isCorrect: false },
          { text: `${randomNum}/6`, isCorrect: false },
          { text: `1-${randomNum}/6`, isCorrect: false }
        ];
        explanation = `When rolling a die ${randomNum} times, the probability of not getting a 6 in any roll is (5/6)^${randomNum}. So, the probability of getting at least one 6 is 1-(5/6)^${randomNum}.`;
      } 
      else if (topic.name.includes('Reasoning')) {
        // Generate different reasoning questions based on template ID
        const template = templateId.charAt(templateId.length - 1);
        if (template === '0') {
          questionText = `In a sequence 3, 6, 11, 18, 27, what comes next?`;
          options = [
            { text: "38", isCorrect: true },
            { text: "36", isCorrect: false },
            { text: "40", isCorrect: false },
            { text: "42", isCorrect: false }
          ];
          explanation = "The pattern is +3, +5, +7, +9, +11. So after 27, we add 11 to get 38.";
        } 
        else if (template === '1') {
          questionText = `If "COMPUTER" is coded as "RFUVQNPC", how will "PRINTER" be coded?`;
          options = [
            { text: "QSJOUFQ", isCorrect: false },
            { text: "SFUOJSQ", isCorrect: true },
            { text: "QSJOUFS", isCorrect: false },
            { text: "SFUOSJQ", isCorrect: false }
          ];
          explanation = "Each letter is replaced by the previous letter in the alphabet. For PRINTER: P→O, R→Q, I→H, N→M, T→S, E→D, R→Q, which gives OQHMSDR, then reversed to get RDSHMQO.";
        }
        else {
          questionText = `If all roses are flowers and some flowers fade quickly, which of the following statements must be true?`;
          options = [
            { text: "All roses fade quickly", isCorrect: false },
            { text: "Some roses fade quickly", isCorrect: false },
            { text: "No roses fade quickly", isCorrect: false },
            { text: "None of the above", isCorrect: true }
          ];
          explanation = "From the given statements, we can only conclude that roses are flowers. We don't know which flowers fade quickly, so we can't make any definite conclusion about roses fading quickly.";
        }
      }
      else if (topic.name.includes('Percentage')) {
        const price = Math.floor(Math.random() * 1000) + 500;
        const discount = Math.floor(Math.random() * 30) + 10;
        questionText = `A product is marked at ₹${price} and sold at a discount of ${discount}%. What is the selling price?`;
        const sellingPrice = price * (1 - discount/100);
        options = [
          { text: `₹${sellingPrice}`, isCorrect: true },
          { text: `₹${price - discount}`, isCorrect: false },
          { text: `₹${sellingPrice - 10}`, isCorrect: false },
          { text: `₹${sellingPrice + 15}`, isCorrect: false }
        ];
        explanation = `To find the selling price, we calculate: Marked price - Discount = ₹${price} - ${discount}% of ₹${price} = ₹${price} - ₹${price * discount/100} = ₹${sellingPrice}`;
      } 
      else {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 10) + 10;
        questionText = `If A can complete a work in ${a} days and B can complete the same work in ${b} days, how many days will they take to complete the work together?`;
        const answer = (a * b) / (a + b);
        options = [
          { text: `${answer.toFixed(1)} days`, isCorrect: true },
          { text: `${(answer + 1.5).toFixed(1)} days`, isCorrect: false },
          { text: `${(answer - 1).toFixed(1)} days`, isCorrect: false },
          { text: `${(a + b) / 2} days`, isCorrect: false }
        ];
        explanation = `A's one day work = 1/${a}, B's one day work = 1/${b}. Together they complete (1/${a} + 1/${b}) = (${b}+${a})/${a*b} = ${a+b}/${a*b} of the work in one day. So they'll complete the entire work in ${a*b}/${a+b} = ${answer.toFixed(2)} days.`;
      }
    } 
    else if (topic.category === 'programming') {
      const languages = ["Java", "Python", "JavaScript", "C++"];
      const randomLang = languages[Math.floor(Math.random() * languages.length)];
      questionText = `Which of the following is NOT a feature of ${randomLang}?`;
      options = [
        { text: randomLang === "Java" ? "Pointer arithmetic" : "Automatic garbage collection", isCorrect: randomLang === "Java" },
        { text: "Object-oriented programming", isCorrect: false },
        { text: "Exception handling", isCorrect: false },
        { text: randomLang !== "Java" ? "Manual memory management" : "Function overloading", isCorrect: randomLang !== "Java" }
      ];
      explanation = randomLang === "Java" ? 
        "Java does not support pointer arithmetic unlike languages like C and C++. Java uses references instead of pointers and handles memory management automatically." : 
        `This question varies based on the language. For ${randomLang}, manual memory management is not a key feature as it has automatic garbage collection, unlike C where memory must be manually managed.`;
    }
    else if (topic.category === 'dsa') {
      const dataStructures = ["Arrays", "Linked Lists", "Trees", "Graphs", "Hash Tables"];
      const randomDS = dataStructures[Math.floor(Math.random() * dataStructures.length)];
      questionText = `What is the time complexity of searching an element in ${randomDS}?`;
      let correctAnswer = "";
      if (randomDS === "Arrays") correctAnswer = "O(n) for unsorted arrays, O(log n) for sorted arrays using binary search";
      else if (randomDS === "Linked Lists") correctAnswer = "O(n)";
      else if (randomDS === "Trees") correctAnswer = "O(log n) for balanced binary search trees, O(n) for unbalanced trees";
      else if (randomDS === "Graphs") correctAnswer = "O(V+E) using BFS or DFS, where V is the number of vertices and E is the number of edges";
      else correctAnswer = "O(1) average case, O(n) worst case";
      
      options = [
        { text: correctAnswer, isCorrect: true },
        { text: "O(1) in all cases", isCorrect: false },
        { text: "O(n²)", isCorrect: false },
        { text: "O(n log n)", isCorrect: false }
      ];
      explanation = `For ${randomDS}, the time complexity for searching is ${correctAnswer}. This is because of the structure's organization and access patterns.`;
    }
    else if (topic.category === 'reasoning') {
      // Generate various reasoning questions
      const template = parseInt(templateId.charAt(templateId.length - 1)) % 4;
      
      if (template === 0 && topic.name.includes('Verbal')) {
        questionText = "Doctor is to Patient as Teacher is to:";
        options = [
          { text: "School", isCorrect: false },
          { text: "Student", isCorrect: true },
          { text: "Education", isCorrect: false },
          { text: "Book", isCorrect: false }
        ];
        explanation = "The relationship is that of a professional and the person they serve/help. A doctor serves patients, and similarly, a teacher serves students.";
      }
      else if (template === 1 && topic.name.includes('Syllogism')) {
        questionText = "All mammals are warm-blooded. All whales are mammals. Which conclusion follows?";
        options = [
          { text: "All warm-blooded animals are mammals", isCorrect: false },
          { text: "All whales are warm-blooded", isCorrect: true },
          { text: "Some warm-blooded animals are not mammals", isCorrect: false },
          { text: "No conclusion follows", isCorrect: false }
        ];
        explanation = "From the premises 'All mammals are warm-blooded' and 'All whales are mammals', we can logically conclude that 'All whales are warm-blooded' using the transitive property of syllogism.";
      }
      else if (template === 2 && topic.name.includes('Pattern')) {
        questionText = "What comes next in the pattern? 2, 6, 18, 54, ?";
        options = [
          { text: "108", isCorrect: false },
          { text: "162", isCorrect: true },
          { text: "216", isCorrect: false },
          { text: "324", isCorrect: false }
        ];
        explanation = "Each number is multiplied by 3 to get the next number: 2×3=6, 6×3=18, 18×3=54, 54×3=162";
      }
      else {
        questionText = "In a certain code, 'TEMPLE' is written as 'DKOLDS'. How would 'PRAYER' be written in that code?";
        options = [
          { text: "XQDZFS", isCorrect: false },
          { text: "QDZXFS", isCorrect: true },
          { text: "QZXDFS", isCorrect: false },
          { text: "QDXZFS", isCorrect: false }
        ];
        explanation = "The coding pattern is: shift each letter 2 positions backward in the alphabet and then reverse the position of adjacent letters. So, P→N→Q, R→P→D, A→Y→Z, Y→W→X, E→C→F, R→P→S, giving us QDZXFS.";
      }
    }
    
    questions.push({
      text: `${questionText} (${timestamp.slice(0,10)})`,
      options,
      explanation,
      topic: topic.name,
      templateId
    });
  }
  
  return { questions };
};
