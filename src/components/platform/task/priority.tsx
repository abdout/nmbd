import { FC } from 'react';

interface PriorityProps {
  priority: string;
  setPriority: (priority: string) => void;
}

type Option = 'محايد' | 'منخفض' | 'متوسط' | 'عالي';

const Priority: FC<PriorityProps> = ({ priority, setPriority }) => {
  const options: Option[] = ['محايد', 'منخفض', 'متوسط', 'عالي'];
  const colors: Record<Option, string> = {
    'محايد': 'bg-gray-400',
    'منخفض': 'bg-green-400',
    'متوسط': 'bg-yellow-400',
    'عالي': 'bg-red-400'
  };

  return (
    <div>
      {options.map((option) => (
        <div 
          key={option} 
          onClick={() => setPriority(option)}
          className={`flex items-center cursor-pointer gap-3 ${priority === option ? 'opacity-100' : 'opacity-50'}`}
        >
          <span 
            className={`inline-block w-4 h-4 rounded-full mr-3 ${colors[option]}`}
          />
          {option}
        </div>
      ))}
    </div>
  );
};

export default Priority;