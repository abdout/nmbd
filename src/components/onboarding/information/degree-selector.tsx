import { Button } from "@/components/ui/button";
import { UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";

interface DegreeSelectorProps {
  setValue: UseFormSetValue<InformationSchema>;
  educationLevel: string;
  setEducationLevel: (level: string) => void;
}

const DegreeSelector = ({ setValue, educationLevel, setEducationLevel }: DegreeSelectorProps) => {
  return (
    <div dir="rtl" className="flex flex-col">
      <p className="text-sm font-semibold mb-2">الدرجة العلمية:</p>
      <hr className="w-20 h-[1px] bg-black -mt-1 mb-2" />
      <div className="flex justify-between">
        {[
          { id: 'student', label: 'طالب' },
          { id: 'diploma', label: 'دبلوم' },
          { id: 'bachelor', label: 'بكالوريوس' },
          { id: 'master', label: 'ماجستير' },
          { id: 'phd', label: 'دكتوراه' },
          { id: 'professor', label: 'أستاذية' }
        ].map((level) => (
          <Button
            key={level.id}
            size='sm'
            type="button"
            onClick={() => {
              setValue('educationLevel', level.id);
              setEducationLevel(level.id);
            }}
            className={`h-6 shadow-none ${educationLevel === level.id ? 'bg-neutral-200' : 'bg-background'} text-black hover:bg-neutral-200 focus:bg-neutral-200`}
          >
            {level.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DegreeSelector; 