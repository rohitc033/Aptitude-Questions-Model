
import { useEffect, useState } from "react";
import { formatTime } from "@/utils/quizUtils";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  duration: number;
  onTimeout: () => void;
  isActive?: boolean;
  key?: string | number; // Added key prop for forcing reset
}

const QuizTimer = ({ 
  duration, 
  onTimeout, 
  isActive = true,
  key
}: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;
  
  // Reset timer when duration or key changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, key]);
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeout, isActive, key]);
  
  // Color based on time left
  let colorClass = "bg-green-500";
  if (progress < 50) colorClass = "bg-yellow-500";
  if (progress < 20) colorClass = "bg-red-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Time Left</span>
        <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
      </div>
      <Progress value={progress} className="h-2">
        <div 
          className={cn("h-full rounded-full", colorClass)} 
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  );
};

export default QuizTimer;
