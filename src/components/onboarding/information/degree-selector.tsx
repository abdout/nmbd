import { Button } from "@/components/ui/button";
import { UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import { useEffect } from "react";

interface DegreeSelectorProps {
  setValue: UseFormSetValue<InformationSchema>;
  educationLevel: string;
  setEducationLevel: (level: string) => void;
}

const DegreeSelector = ({ setValue, educationLevel, setEducationLevel }: DegreeSelectorProps) => {
  // Set default to student if not already set
  useEffect(() => {
    if (!educationLevel) {
      setEducationLevel('student');
      setValue('educationLevel', 'student');
    }
  }, []);

  const handleLevelSelect = (level: string) => {
    setEducationLevel(level);
    setValue('educationLevel', level);
  };

  return (
    <div dir="rtl" className="flex flex-col">
      <p className="text-sm font-semibold mb-2">الدرجة العلمية:</p>
      <hr className="w-20 h-[1px] bg-black -mt-1 mb-3" />
      <div className="flex  gap-2 mb-4">
        {[
          { id: 'student', label: 'طالب' },
          { id: 'diploma', label: 'دبلوم' },
          { id: 'bachelor', label: 'بكالوريوس' },
          { id: 'master', label: 'ماجستير' },
          { id: 'phd', label: 'دكتوراه' },
          { id: 'professor', label: 'أستاذية' },
        ].map((option) => (
          <Button
            key={option.id}
            type="button"
            variant='ghost'
            size='sm' 
            className={`px-3 text-sm rounded-full  ${
              educationLevel === option.id ? "bg-neutral-200 hover:bg-neutral-200" : "bg-background"
            }`}
            onClick={() => handleLevelSelect(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DegreeSelector; 