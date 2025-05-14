
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-bold text-quiz-primary">Career Catalyst</h1>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-quiz-primary transition-colors">
                  Instructions
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
