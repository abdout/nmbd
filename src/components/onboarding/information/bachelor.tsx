'use client';
import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { institutions, bachelorMajors, generateCompletionYears } from "./constants";

interface BachelorProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Bachelor = ({
  register,
  errors,
  setValue
}: BachelorProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedBachelorCompletionYear, setSelectedBachelorCompletionYear] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorInstitution', item.label);
      setSelectedInstitution(item);
    } else {
      setValue('bachelorInstitution', '');
      setSelectedInstitution(null);
    }
  };

  // Handle bachelor completion year selection
  const handleBachelorYearSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorCompletionYear', item.value);
      setSelectedBachelorCompletionYear(item);
    } else {
      setValue('bachelorCompletionYear', undefined);
      setSelectedBachelorCompletionYear(null);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('bachelorMajor', item.label);
      setSelectedMajor(item);
    } else {
      setValue('bachelorMajor', '');
      setSelectedMajor(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات البكالوريوس:</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Institution */}
        <div className="relative">
          <input type="hidden" {...register('bachelorInstitution')} value={selectedInstitution?.label || ''} />
          <SelectPopover
            items={institutions}
            selectedItem={selectedInstitution}
            setSelectedItem={handleInstitutionSelect}
            label="الجامعة"
          />
          {errors.bachelorInstitution && (
            <span className="text-red-500 text-sm">{errors.bachelorInstitution.message}</span>
          )}
        </div>

        {/* Major */}
        <div className="relative">
          <input type="hidden" {...register('bachelorMajor')} value={selectedMajor?.label || ''} />
          <SelectPopover
            items={bachelorMajors}
            selectedItem={selectedMajor}
            setSelectedItem={handleMajorSelect}
            label="التخصص"
          />
          {errors.bachelorMajor && (
            <span className="text-red-500 text-sm">{errors.bachelorMajor.message}</span>
          )}
        </div>

        {/* Completion Year */}
        <div className="relative">
          <input type="hidden" {...register('bachelorCompletionYear')} value={selectedBachelorCompletionYear?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedBachelorCompletionYear}
            setSelectedItem={handleBachelorYearSelect}
            label="السنة"
          />
          {errors.bachelorCompletionYear && (
            <span className="text-red-500 text-sm">{errors.bachelorCompletionYear.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bachelor; 