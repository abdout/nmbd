'use client';
import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { institutions, phdMajors, generateCompletionYears } from "./constants";

interface PhDProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const PhD = ({
  register,
  errors,
  setValue
}: PhDProps) => {
  const [selectedPhdInstitution, setSelectedPhdInstitution] = useState<Item | null>(null);
  const [selectedPhdCompletionYear, setSelectedPhdCompletionYear] = useState<Item | null>(null);
  const [selectedPhdMajor, setSelectedPhdMajor] = useState<Item | null>(null);

  // Handle PhD institution selection
  const handlePhdInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('phdInstitution', item.label);
      setSelectedPhdInstitution(item);
    } else {
      setValue('phdInstitution', '');
      setSelectedPhdInstitution(null);
    }
  };

  // Handle PhD completion year selection
  const handlePhdYearSelect = (item: Item | null) => {
    if (item) {
      setValue('phdCompletionYear', item.value);
      setSelectedPhdCompletionYear(item);
    } else {
      setValue('phdCompletionYear', '');
      setSelectedPhdCompletionYear(null);
    }
  };

  // Handle PhD major selection
  const handlePhdMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('phdMajor', item.label);
      setSelectedPhdMajor(item);
    } else {
      setValue('phdMajor', '');
      setSelectedPhdMajor(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Institution */}
      <div className="relative">
        <input type="hidden" {...register('phdInstitution')} value={selectedPhdInstitution?.label || ''} />
        <SelectPopover
          items={institutions}
          selectedItem={selectedPhdInstitution}
          setSelectedItem={handlePhdInstitutionSelect}
          label="الجامعة"
        />
        {errors.phdInstitution && (
          <span className="text-red-500 text-sm">{errors.phdInstitution.message}</span>
        )}
      </div>

      {/* Major */}
      <div className="relative">
        <input type="hidden" {...register('phdMajor')} value={selectedPhdMajor?.label || ''} />
        <SelectPopover
          items={phdMajors}
          selectedItem={selectedPhdMajor}
          setSelectedItem={handlePhdMajorSelect}
          label="التخصص"
        />
        {errors.phdMajor && (
          <span className="text-red-500 text-sm">{errors.phdMajor.message}</span>
        )}
      </div>

      {/* Completion Year */}
      <div className="relative">
        <input type="hidden" {...register('phdCompletionYear')} value={selectedPhdCompletionYear?.value || ''} />
        <SelectPopover
          items={generateCompletionYears()}
          selectedItem={selectedPhdCompletionYear}
          setSelectedItem={handlePhdYearSelect}
          label="السنة"
        />
        {errors.phdCompletionYear && (
          <span className="text-red-500 text-sm">{errors.phdCompletionYear.message}</span>
        )}
      </div>
    </div>
  );
};

export default PhD; 