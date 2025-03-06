'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { institutions, masterMajors, generateCompletionYears } from "./constants";

interface MasterProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Master = ({
  register,
  errors,
  setValue
}: MasterProps) => {
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
        // Dispatch event when all Master fields are completed
        const event = new CustomEvent('educationFieldCompleted', {
          detail: {
            componentType: 'master',
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
      setValue('masterInstitution', item.label);
      setSelectedInstitution(item);
      setInstitutionCompleted(true);
    } else {
      setValue('masterInstitution', '');
      setSelectedInstitution(null);
      setInstitutionCompleted(false);
    }
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('masterMajor', item.label);
      setSelectedMajor(item);
      setMajorCompleted(true);
    } else {
      setValue('masterMajor', '');
      setSelectedMajor(null);
      setMajorCompleted(false);
    }
  };

  // Handle completion year selection
  const handleCompletionYearSelect = (item: Item | null) => {
    if (item) {
      setValue('masterCompletionYear', item.value);
      setSelectedCompletionYear(item);
      setYearCompleted(true);
    } else {
      setValue('masterCompletionYear', '');
      setSelectedCompletionYear(null);
      setYearCompleted(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الماجستير:</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Institution */}
        <div className="relative">
          <input type="hidden" {...register('masterInstitution')} value={selectedInstitution?.label || ''} />
          <SelectPopover
            items={institutions}
            selectedItem={selectedInstitution}
            setSelectedItem={handleInstitutionSelect}
            label="الجامعة"
          />
          {errors.masterInstitution && (
            <span className="text-red-500 text-sm">{errors.masterInstitution.message}</span>
          )}
        </div>

        {/* Major */}
        <div className="relative">
          <input type="hidden" {...register('masterMajor')} value={selectedMajor?.label || ''} />
          <SelectPopover
            items={masterMajors}
            selectedItem={selectedMajor}
            setSelectedItem={handleMajorSelect}
            label="التخصص"
          />
          {errors.masterMajor && (
            <span className="text-red-500 text-sm">{errors.masterMajor.message}</span>
          )}
        </div>

        {/* Completion Year */}
        <div className="relative">
          <input type="hidden" {...register('masterCompletionYear')} value={selectedCompletionYear?.value || ''} />
          <SelectPopover
            items={generateCompletionYears()}
            selectedItem={selectedCompletionYear}
            setSelectedItem={handleCompletionYearSelect}
            label="السنة"
          />
          {errors.masterCompletionYear && (
            <span className="text-red-500 text-sm">{errors.masterCompletionYear.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Master; 