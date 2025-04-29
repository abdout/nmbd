'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { EducationSchema } from "./validation";
import SelectPopover, { Item } from "../information/select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, generateCompletionYears } from "./constant";
import { useFocusField } from "../useFocusField";

interface BachelorProps {
  register: UseFormRegister<EducationSchema>;
  errors: FieldErrors<EducationSchema>;
  setValue: UseFormSetValue<EducationSchema>;
  onComplete?: () => void;
}

// Convert Item arrays to Option arrays
const INSTITUTIONS: Option[] = institutions.map(item => ({
  value: item.value,
  label: item.label
}));

const BACHELOR_MAJORS: Option[] = [
  { value: 'computer_science', label: 'علوم حاسوب' },
  { value: 'engineering', label: 'هندسة' }
].map(item => ({
  value: item.value,
  label: item.label
}));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
  value: item.value,
  label: item.label
}));

const Bachelor = ({
  register,
  errors,
  setValue,
  onComplete
}: BachelorProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedBachelorYear, setSelectedBachelorYear] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [, setBachelorCompleted] = useState(false);

  const { getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusField<'institution' | 'major' | 'year'>();

  // Register fields with React Hook Form
  useEffect(() => {
    register('bachelorInstitution');
    register('bachelorMajor');
    register('bachelorCompletionYear');
  }, [register]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    setValue('bachelorInstitution', item?.label || '');
    setSelectedInstitution(item);
  };

  // Handle bachelor completion year selection
  const handleBachelorYearSelect = (item: Item | null) => {
    setValue('bachelorCompletionYear', item?.value || '');
    setSelectedBachelorYear(item);
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    setValue('bachelorMajor', item?.label || '');
    setSelectedMajor(item);
  };

  // Define the hierarchical steps for bachelor selection
  const bachelorSteps: SelectionStep[] = [
    {
      id: "institution",
      title: "الجامعة",
      placeholder: "اختر الجامعة",
      emptyMessage: "لا توجد جامعات متاحة",
      getOptions: () => INSTITUTIONS
    },
    {
      id: "major",
      title: "التخصص",
      placeholder: "اختر التخصص",
      emptyMessage: "لا توجد تخصصات متاحة",
      getOptions: () => BACHELOR_MAJORS
    },
    {
      id: "completionYear",
      title: "سنة التخرج",
      placeholder: "اختر السنة",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => COMPLETION_YEARS
    }
  ];

  // Handle completion of the hierarchical selection
  const handleComplete = (selections: Record<string, Option>) => {
    setValue('bachelorInstitution', selections.institution?.label || '');
    setValue('bachelorMajor', selections.major?.label || '');
    setValue('bachelorCompletionYear', selections.completionYear?.value || '');
    
    setBachelorCompleted(true);
    
    if (selections.institution?.value &&
        selections.major?.value &&
        selections.completionYear?.value &&
        onComplete) {
      setTimeout(() => {
        onComplete();
      }, 300);
    }
    
    const event = new CustomEvent('educationFieldCompleted', {
      detail: {
        componentType: 'bachelor',
        fieldType: 'all'
      }
    });
    document.dispatchEvent(event);
  };

  const timing = {
    transitionDelay: 250,
    dropdownDelay: 600
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات البكالوريوس:</p>
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution', 3)}>
            <input type="hidden" {...register('bachelorInstitution')} value={selectedInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedInstitution}
              setSelectedItem={handleInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Major */}
          <div className={getFieldStyle('major', 3)}>
            <input type="hidden" {...register('bachelorMajor')} value={selectedMajor?.label || ''} />
            <SelectPopover
              items={BACHELOR_MAJORS}
              selectedItem={selectedMajor}
              setSelectedItem={handleMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('year', 3)}>
            <input type="hidden" {...register('bachelorCompletionYear')} value={selectedBachelorYear?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedBachelorYear}
              setSelectedItem={handleBachelorYearSelect}
              label="السنة"
              onFocus={() => setFocusedField('year')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        </div>
      </div>

      {/* Mobile UI (smaller than md screens) */}
      <div className="md:hidden relative" style={{ 
        zIndex: 40,
        position: "relative",
        isolation: "isolate" 
      }}>
        <AnimatedHierarchicalSelect 
          steps={bachelorSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Bachelor; 