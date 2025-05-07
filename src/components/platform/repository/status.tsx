import { FC } from 'react';
import { ISSUE_STATUS } from '../issue/validation';

interface StatusProps {
  status: "pending" | "stuck" | "in_progress" | "done";
  setStatus: (status: "pending" | "stuck" | "in_progress" | "done") => void;
}

// Define UI options in Arabic and their mapping to actual enum values
const statusOptions = [
  { label: 'محايد', value: ISSUE_STATUS.PENDING },
  { label: 'جاري', value: ISSUE_STATUS.IN_PROGRESS },
  { label: 'تم', value: ISSUE_STATUS.DONE },
  { label: 'متوقف', value: ISSUE_STATUS.STUCK }
];

const Status: FC<StatusProps> = ({ status, setStatus }) => {
  const colors: Record<string, string> = {
    'محايد': 'bg-gray-400',
    'جاري': 'bg-yellow-400',
    'تم': 'bg-green-400',
    'متوقف': 'bg-red-400'
  };

  // Find the Arabic label that corresponds to the current status value
  const getCurrentLabel = () => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'محايد';
  };

  return (
    <div>
      {statusOptions.map((option) => (
        <div 
          key={option.label} 
          onClick={() => setStatus(option.value)}
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

export default Status;