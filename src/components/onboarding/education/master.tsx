'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { EducationSchema } from "./validation";
import SelectPopover, { Item } from "../information/select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, masterMajors, generateCompletionYears } from "./constant";
import { useFocusSelect } from "@/components/onboarding/use-focus";
import { useFocusField } from "../useFocusField";

interface MasterProps {
  register: UseFormRegister<EducationSchema>;
  errors: FieldErrors<EducationSchema>;
  setValue: UseFormSetValue<EducationSchema>;
  onComplete?: () => void;
}

// Convert Item arrays to Option arrays
const INSTITUTIONS: Option[] = institutions.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const MASTER_MAJORS: Option[] = masterMajors.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
  value: item.value,
  label: item.label
} as Option));

const Master = ({
  register,
  errors,
  setValue,
  onComplete
}: MasterProps) => {
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [selectedCompletionYear, setSelectedCompletionYear] = useState<Item | null>(null);
  const [masterCompleted, setMasterCompleted] = useState(false);

  const { getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusSelect<'institution' | 'major' | 'year'>();

  // Register fields with React Hook Form
  useEffect(() => {
    register('masterInstitution');
    register('masterMajor');
    register('masterCompletionYear');
  }, [register]);

  // Handle institution selection
  const handleInstitutionSelect = (item: Item | null) => {
    setValue('masterInstitution', item?.label || '');
    setSelectedInstitution(item);
  };

  // Handle major selection
  const handleMajorSelect = (item: Item | null) => {
    setValue('masterMajor', item?.label || '');
    setSelectedMajor(item);
  };

  // Handle completion year selection
  const handleCompletionYearSelect = (item: Item | null) => {
    setValue('masterCompletionYear', item?.value || '');
    setSelectedCompletionYear(item);
  };

  // Define the hierarchical steps for master selection
  const masterSteps: SelectionStep[] = [
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
      getOptions: () => MASTER_MAJORS
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
    setValue('masterInstitution', selections.institution?.label || '');
    setValue('masterMajor', selections.major?.label || '');
    setValue('masterCompletionYear', selections.completionYear?.value || '');
    
    setMasterCompleted(true);
    
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
        componentType: 'master',
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
      <p className="text-sm font-semibold mb-2">بيانات الماجستير:</p>
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution')}>
            <input type="hidden" {...register('masterInstitution')} value={selectedInstitution?.label || ''} />
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
          <div className={getFieldStyle('major')}>
            <input type="hidden" {...register('masterMajor')} value={selectedMajor?.label || ''} />
            <SelectPopover
              items={masterMajors}
              selectedItem={selectedMajor}
              setSelectedItem={handleMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('year')}>
            <input type="hidden" {...register('masterCompletionYear')} value={selectedCompletionYear?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedCompletionYear}
              setSelectedItem={handleCompletionYearSelect}
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
          steps={masterSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Master; 