
import { QuizOption as QuizOptionType } from "@/types/quiz";

interface QuizOptionProps {
  option: QuizOptionType;
  isSelected: boolean;
  isRevealed: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const QuizOption = ({ option, isSelected, isRevealed, onSelect, disabled = false }: QuizOptionProps) => {
  let buttonClass = "w-full text-left px-4 py-3 rounded-md border transition-all duration-200 ";
  
  if (isRevealed) {
    buttonClass += option.isCorrect 
      ? "border-green-500 bg-green-50 text-green-700" 
      : isSelected 
        ? "border-red-500 bg-red-50 text-red-700" 
        : "border-gray-300";
  } else {
    buttonClass += isSelected 
      ? "border-blue-500 bg-blue-50 text-blue-700" 
      : "border-gray-300 hover:border-gray-400";
  }
  
  return (
    <button
      onClick={onSelect}
      disabled={disabled || isRevealed}
      className={buttonClass}
      data-option-id={option.id}
    >
      <div className="flex items-start">
        <span className="font-medium">{option.text}</span>
      </div>
    </button>
  );
};

export default QuizOption;
