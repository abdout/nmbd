import { FC } from 'react';
import { ISSUE_PRIORITY } from './validation';

interface PriorityProps {
  priority: "pending" | "high" | "medium" | "low";
  setPriority: (priority: "pending" | "high" | "medium" | "low") => void;
}

// Define UI options in Arabic and their mapping to actual enum values
const priorityOptions = [
  { label: 'محايد', value: ISSUE_PRIORITY.PENDING },
  { label: 'منخفض', value: ISSUE_PRIORITY.LOW },
  { label: 'متوسط', value: ISSUE_PRIORITY.MEDIUM },
  { label: 'عالي', value: ISSUE_PRIORITY.HIGH }
];

const Priority: FC<PriorityProps> = ({ priority, setPriority }) => {
  const colors: Record<string, string> = {
    'محايد': 'bg-gray-400',
    'منخفض': 'bg-green-400',
    'متوسط': 'bg-yellow-400',
    'عالي': 'bg-red-400'
  };

  // Find the Arabic label that corresponds to the current priority value
  const getCurrentLabel = () => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : 'محايد';
  };

  return (
    <div>
      {priorityOptions.map((option) => (
        <div 
          key={option.label} 
          onClick={() => setPriority(option.value)}
          className={`flex items-center cursor-pointer gap-3 ${getCurrentLabel() === option.label ? 'opacity-100' : 'opacity-50'}`}
        >
          <span 
            className={`inline-block w-4 h-4 rounded-full mr-3 ${colors[option.label]}`}
          />
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default Priority;