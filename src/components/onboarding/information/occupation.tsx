import React from 'react';
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { InformationSchema } from "./validation";

interface OccupationProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  educationLevel: string;
}

const Occupation = ({ register, errors, educationLevel }: OccupationProps) => {
  // Don't render for students
  if (educationLevel === 'student') {
    return null;
  }

  return (
    <div className="pt-4 border-t">
      <p className="text-sm font-semibold mb-2">الدرجة الوظيفية:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 gap-4">
        {/* Current occupation/rank */}
        <div className="relative">
          <Input
            id="currentOccupation"
            placeholder="المنصب الحالي"
            {...register('currentOccupation')}
          />
          {errors.currentOccupation && (
            <span className="text-red-500 text-sm">{errors.currentOccupation.message}</span>
          )}
        </div>

        {/* Company name */}
        <div className="relative">
          <Input
            id="companyName"
            placeholder="اسم الشركة"
            {...register('companyName')}
          />
          {errors.companyName && (
            <span className="text-red-500 text-sm">{errors.companyName.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Occupation; 