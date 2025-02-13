import { FC } from 'react';

interface StatusProps {
  status: string;
  setStatus: (status: string) => void;
}

type Option = 'محايد' | 'جاري' | 'تم' | 'متوقف';

const Status: FC<StatusProps> = ({ status, setStatus }) => {
  const options: Option[] = ['محايد', 'جاري', 'تم', 'متوقف'];
  const colors: Record<Option, string> = {
    'محايد': 'bg-gray-400',
    'جاري': 'bg-yellow-400',
    'تم': 'bg-green-400',
    'متوقف': 'bg-red-400'
  };

  return (
    <div>
      {options.map((option) => (
        <div 
          key={option} 
          onClick={() => setStatus(option)}
          className={`flex items-center cursor-pointer gap-3 ${status === option ? 'opacity-100' : 'opacity-50'}`}
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

export default Status;