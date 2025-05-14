
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-quiz-primary">About Career Catalyst</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Career Catalyst is designed to help students and professionals sharpen their skills in Aptitude, 
              Programming Languages, and Data Structures & Algorithms. Our platform provides personalized 
              quizzes with detailed explanations to enhance learning and retention.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="mb-4 text-center">
                  <div className="w-16 h-16 bg-quiz-light rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-quiz-primary">1</span>
                  </div>
                </div>
                <h3 className="font-medium text-center mb-2">Choose Topics</h3>
                <p className="text-gray-600 text-sm">
                  Select from our extensive list of topics across Aptitude, Programming Languages, and DSA.
                </p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="mb-4 text-center">
                  <div className="w-16 h-16 bg-quiz-light rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-quiz-primary">2</span>
                  </div>
                </div>
                <h3 className="font-medium text-center mb-2">Take the Quiz</h3>
                <p className="text-gray-600 text-sm">
                  Answer 10 questions tailored to your selected topics and difficulty level.
                </p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <div className="mb-4 text-center">
                  <div className="w-16 h-16 bg-quiz-light rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-quiz-primary">3</span>
                  </div>
                </div>
                <h3 className="font-medium text-center mb-2">Learn & Improve</h3>
                <p className="text-gray-600 text-sm">
                  Review detailed explanations for each question and track your progress over time.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Customizable quizzes across 30+ topics</li>
              <li>Multiple difficulty levels to match your expertise</li>
              <li>Detailed explanations for every question</li>
              <li>Timed questions to simulate exam conditions</li>
              <li>Performance analytics to track your progress</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Get Started</h2>
            <p className="text-gray-700 mb-4">
              Ready to challenge yourself? Head back to the home page and create your first quiz!
            </p>
          </section>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 Career Catalyst. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
