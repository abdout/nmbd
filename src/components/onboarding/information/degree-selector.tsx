import { Button } from "@/components/ui/button";
import { UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      setValue('educationLevel', 'student');
      setEducationLevel('student');
    }
  }, [educationLevel, setValue, setEducationLevel]);

  const handleValueChange = (value: string) => {
    setValue('educationLevel', value);
    setEducationLevel(value);
  };

  // Common education levels for both mobile and desktop
  const educationLevels = [
    { id: 'student', label: 'طالب' },
    { id: 'diploma', label: 'دبلوم' },
    { id: 'bachelor', label: 'بكالوريوس' },
    { id: 'master', label: 'ماجستير' },
    { id: 'phd', label: 'دكتوراه' },
    { id: 'professor', label: 'أستاذية' }
  ];

  return (
    <div dir="rtl" className="flex flex-col">
      {/* Title with responsive styling for the colon */}
      <p className="text-sm font-semibold mb-2">
        الدرجة العلمية<span className="hidden md:inline">:</span>
      </p>
      
      {/* Desktop UI (md screens and above) */}
      <div className="hidden md:block">
        <hr className="w-20 h-[1px] bg-black -mt-1 mb-3" />
        <div className="flex justify-between pl-10">
          {educationLevels.map((level) => (
            <Button
              key={level.id}
              size='sm'
              type="button"
              onClick={() => handleValueChange(level.id)}
              className={`h-7 text-[13px] pb-1 shadow-none rounded-full ${educationLevel === level.id ? 'bg-neutral-200' : 'bg-background'} text-black hover:bg-neutral-100 focus:bg-neutral-200`}
            >
              {level.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Mobile UI (smaller than md screens) */}
      <div className="md:hidden w-full">
        <Select
          onValueChange={handleValueChange}
          value={educationLevel || "student"}
          dir="rtl"
        >
          <SelectTrigger className="h-9 text-right" aria-label="الدرجة العلمية">
            <SelectValue placeholder="اختر الدرجة العلمية" />
          </SelectTrigger>
          <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
            {educationLevels.map((level) => (
              <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DegreeSelector; 