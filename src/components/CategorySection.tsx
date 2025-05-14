
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Topic } from "@/types/quiz";

interface CategorySectionProps {
  title: string;
  topics: Topic[];
  selectedTopics: Topic[];
  onTopicChange: (topic: Topic, isChecked: boolean) => void;
}

const CategorySection = ({
  title,
  topics,
  selectedTopics,
  onTopicChange,
}: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedTopics = isExpanded ? topics : topics.slice(0, 6);
  
  const isTopicSelected = (topic: Topic) => {
    return selectedTopics.some(selectedTopic => selectedTopic.id === topic.id);
  };

  return (
    <div className="mb-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="checkbox-container">
        {displayedTopics.map((topic) => (
          <div key={topic.id} className="checkbox-item">
            <Checkbox 
              id={topic.id} 
              checked={isTopicSelected(topic)}
              onCheckedChange={(checked) => onTopicChange(topic, !!checked)} 
            />
            <Label htmlFor={topic.id} className="cursor-pointer">{topic.name}</Label>
          </div>
        ))}
      </div>
      {topics.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-quiz-primary hover:text-quiz-secondary mt-2 text-sm font-medium"
        >
          {isExpanded ? "Show less" : `Show ${topics.length - 6} more`}
        </button>
      )}
    </div>
  );
};

export default CategorySection;
