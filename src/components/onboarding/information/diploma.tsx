'use client';
import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { institutions, diplomaMajors, generateCompletionYears } from "./constants";

interface DiplomaProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Diploma = ({
  register,
  errors,
  setValue
}: DiplomaProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedYearOfCompletion, setSelectedYearOfCompletion] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('diplomaInstitution', item.label);
      setSelectedInstitution(item);
    } else {
      setValue('diplomaInstitution', '');
      setSelectedInstitution(null);
    }
  };

  // Handle year of completion selection
  const handleYearOfCompletionSelect = (item: Item | null) => {
    if (item) {
      setValue('diplomaCompletionYear', item.value);
      setSelectedYearOfCompletion(item);
    } else {
      setValue('diplomaCompletionYear', undefined);
      setSelectedYearOfCompletion(null);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('diplomaMajor', item.label);
      setSelectedMajor(item);
    } else {
      setValue('diplomaMajor', '');
      setSelectedMajor(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الدبلوم:</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Institution */}
        <div className="relative">
          <input type="hidden" {...register('diplomaInstitution')} value={selectedInstitution?.label || ''} />
          <SelectPopover
            items={institutions}
            selectedItem={selectedInstitution}
            setSelectedItem={handleInstitutionSelect}
            label="الجامعة"
          />
          {errors.diplomaInstitution && (
            <span className="text-red-500 text-sm">{errors.diplomaInstitution.message}</span>
          )}
        </div>

        {/* Major */}
        <div className="relative">
          <input type="hidden" {...register('diplomaMajor')} value={selectedMajor?.label || ''} />
          <SelectPopover
            items={diplomaMajors}
            selectedItem={selectedMajor}
            setSelectedItem={handleMajorSelect}
            label="التخصص"
          />
          {errors.diplomaMajor && (
            <span className="text-red-500 text-sm">{errors.diplomaMajor.message}</span>
          )}
        </div>

        {/* Year of Completion */}
        <div className="relative">
          <input type="hidden" {...register('diplomaCompletionYear')} value={selectedYearOfCompletion?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedYearOfCompletion}
            setSelectedItem={handleYearOfCompletionSelect}
            label="السنة"
          />
          {errors.diplomaCompletionYear && (
            <span className="text-red-500 text-sm">{errors.diplomaCompletionYear.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diploma; 