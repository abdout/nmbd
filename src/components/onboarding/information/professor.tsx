'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { institutions, professorMajors, generateCompletionYears } from "./constants";

interface ProfessorProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Professor = ({
  register,
  errors,
  setValue
}: ProfessorProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [selectedCompletionYear, setSelectedCompletionYear] = useState<Item | null>(null);

  // Track field completion
  const [institutionCompleted, setInstitutionCompleted] = useState(false);
  const [majorCompleted, setMajorCompleted] = useState(false);
  const [yearCompleted, setYearCompleted] = useState(false);
  
  // Check if all fields are completed
  useEffect(() => {
    if (institutionCompleted && majorCompleted && yearCompleted) {
      // Add a small delay to ensure DOM updates
      setTimeout(() => {
        // Dispatch event when all professor fields are completed
        const event = new CustomEvent('educationFieldCompleted', {
          detail: {
            componentType: 'professor',
            fieldType: 'all'
          }
        });
        document.dispatchEvent(event);
      }, 100);
    }
  }, [institutionCompleted, majorCompleted, yearCompleted]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('professorInstitution', item.label);
      setSelectedInstitution(item);
      setInstitutionCompleted(true);
    } else {
      setValue('professorInstitution', '');
      setSelectedInstitution(null);
      setInstitutionCompleted(false);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('professorMajor', item.label);
      setSelectedMajor(item);
      setMajorCompleted(true);
    } else {
      setValue('professorMajor', '');
      setSelectedMajor(null);
      setMajorCompleted(false);
    }
  };

  // Handle completion year selection
  const handleCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('professorCompletionYear', item.value);
      setSelectedCompletionYear(item);
      setYearCompleted(true);
    } else {
      setValue('professorCompletionYear', '');
      setSelectedCompletionYear(null);
      setYearCompleted(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الأستاذية:</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Institution */}
        <div className="relative">
          <input type="hidden" {...register('professorInstitution')} value={selectedInstitution?.label || ''} />
          <SelectPopover
            items={institutions}
            selectedItem={selectedInstitution}
            setSelectedItem={handleInstitutionSelect}
            label="الجامعة"
          />
          {errors.professorInstitution && (
            <span className="text-red-500 text-sm">{errors.professorInstitution.message}</span>
          )}
        </div>

        {/* Major */}
        <div className="relative">
          <input type="hidden" {...register('professorMajor')} value={selectedMajor?.label || ''} />
          <SelectPopover
            items={professorMajors}
            selectedItem={selectedMajor}
            setSelectedItem={handleMajorSelect}
            label="التخصص"
          />
          {errors.professorMajor && (
            <span className="text-red-500 text-sm">{errors.professorMajor.message}</span>
          )}
        </div>

        {/* Completion Year */}
        <div className="relative">
          <input type="hidden" {...register('professorCompletionYear')} value={selectedCompletionYear?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedCompletionYear}
            setSelectedItem={handleCompletionYearSelect}
            label="السنة"
          />
          {errors.professorCompletionYear && (
            <span className="text-red-500 text-sm">{errors.professorCompletionYear.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Professor; 