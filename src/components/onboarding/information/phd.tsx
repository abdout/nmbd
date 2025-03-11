'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { Option } from "@/components/atom/auto-complete";
import { AnimatedHierarchicalSelect, SelectionStep } from "@/components/atom/hierarchical-select";
import { institutions, phdMajors, generateCompletionYears } from "./constant";
import { useFocusSelect } from "@/components/onboarding/use-focus";


interface PhDProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  onComplete?: () => void;
}

// Convert Item arrays to Option arrays
const INSTITUTIONS: Option[] = institutions.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const PHD_MAJORS: Option[] = phdMajors.map(item => ({
  value: item.value,
  label: item.label
} as Option));

const COMPLETION_YEARS: Option[] = generateCompletionYears().map(item => ({
  value: item.value,
  label: item.label
} as Option));

const PhD = ({
  register,
  errors,
  setValue,
  onComplete
}: PhDProps) => {
  const [selectedPhdInstitution, setSelectedPhdInstitution] = useState<Item | null>(null);
  const [selectedPhdMajor, setSelectedPhdMajor] = useState<Item | null>(null);
  const [selectedPhdYear, setSelectedPhdYear] = useState<Item | null>(null);
  const [phdCompleted, setPhdCompleted] = useState(false);

  // Use the focus field hook for the three fields
  const { focusedField, getFieldStyle, getContainerClass, setFocusedField } = 
    useFocusSelect<'institution' | 'major' | 'year'>();

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('phdInstitution', { required: "يرجى اختيار الجامعة" });
    register('phdMajor', { required: "يرجى اختيار التخصص" });
    register('phdCompletionYear', { required: "يرجى اختيار السنة" });
  }, [register]);

  // After it's mounted, log a message
  useEffect(() => {
    // Empty
  }, [onComplete]);
  
  // Track field selection state changes for debugging
  useEffect(() => {
    // Trigger check all fields on any field state change
    if (selectedPhdInstitution || selectedPhdMajor || selectedPhdYear) {
      checkAllFieldsCompleted();
    }
  }, [selectedPhdInstitution, selectedPhdMajor, selectedPhdYear]);

  // Handle PhD institution selection
  const handlePhdInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('phdInstitution', item.label);
      setSelectedPhdInstitution(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('phdInstitution', '');
      setSelectedPhdInstitution(null);
    }
  };

  // Handle PhD year selection
  const handlePhdYearSelect = (item: Item | null) => {
    if (item) {
      setValue('phdCompletionYear', item.value);
      setSelectedPhdYear(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('phdCompletionYear', '');
      setSelectedPhdYear(null);
    }
  };

  // Handle PhD major selection
  const handlePhdMajorSelect = (item: Item | null) => {
    if (item) {
      setValue('phdMajor', item.label);
      setSelectedPhdMajor(item);
      // Don't call checkAllFieldsCompleted here - it's triggered by useEffect
    } else {
      setValue('phdMajor', '');
      setSelectedPhdMajor(null);
    }
  };

  // Check if all fields are completed and trigger onComplete callback
  const checkAllFieldsCompleted = () => {
    // Check if all fields are filled
    if (selectedPhdInstitution && selectedPhdMajor && selectedPhdYear) {
      // Only proceed if not already marked as completed
      if (!phdCompleted) {
        // Mark the component as completed
        setPhdCompleted(true);
        
        // Call onComplete callback if provided
        if (onComplete) {
          onComplete();
        }
        
        // Dispatch the event for backward compatibility
        const event = new CustomEvent('educationFieldCompleted', {
          detail: {
            componentType: 'phd',
            fieldType: 'all'
          }
        });
        document.dispatchEvent(event);
      }
    }
  };

  // Define the hierarchical steps for PhD selection
  const phdSteps: SelectionStep[] = [
    {
      id: "institution",
      title: "الجامعة",
      placeholder: "اختر الجامعة",
      emptyMessage: "لا توجد جامعات متاحة",
      getOptions: () => INSTITUTIONS
    },
    {
      id: "completionYear",
      title: "سنة التخرج",
      placeholder: "اختر السنة",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => COMPLETION_YEARS
    },
    {
      id: "major",
      title: "التخصص",
      placeholder: "اختر التخصص",
      emptyMessage: "لا توجد تخصصات متاحة",
      getOptions: () => PHD_MAJORS
    }
  ];

  // Handle completion of the hierarchical selection for mobile
  const handleComplete = (selections: Record<string, Option>) => {
    // Map the selections to the form values
    setValue('phdInstitution', selections.institution?.label || '');
    setValue('phdMajor', selections.major?.label || '');
    setValue('phdCompletionYear', selections.completionYear?.value || '');
    
    // Set component as completed
    setPhdCompleted(true);
    
    console.log('[PhDDebug] PhD fields completed in mobile mode:', selections);
    
    // Check if all fields are filled
    if (
      selections.institution?.value &&
      selections.major?.value &&
      selections.completionYear?.value
    ) {
      console.log('[PhDDebug] All PhD fields are filled in mobile mode, calling onComplete');
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    }
    
    // Maintain the original event dispatch for backward compatibility
    const event = new CustomEvent('educationFieldCompleted', {
      detail: {
        componentType: 'phd',
        fieldType: 'all'
      }
    });
    document.dispatchEvent(event);
  };

  // Custom animation timing configurations
  const timing = {
    transitionDelay: 250,
    dropdownDelay: 600
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الدكتوراه:</p>
      
      {/* Show error messages */}
      {(errors.phdInstitution || errors.phdMajor || errors.phdCompletionYear) && (
        <div className="text-red-500 text-sm mb-2">
          {errors.phdInstitution && <p>{errors.phdInstitution.message}</p>}
          {errors.phdMajor && <p>{errors.phdMajor.message}</p>}
          {errors.phdCompletionYear && <p>{errors.phdCompletionYear.message}</p>}
        </div>
      )}
      
      {/* Desktop UI (md screens and above) with focus motion */}
      <div className="hidden md:block">
        <div className={getContainerClass()}>
          {/* Institution */}
          <div className={getFieldStyle('institution', 3)}>
            <input type="hidden" {...register('phdInstitution')} value={selectedPhdInstitution?.label || ''} />
            <SelectPopover
              items={institutions}
              selectedItem={selectedPhdInstitution}
              setSelectedItem={handlePhdInstitutionSelect}
              label="الجامعة"
              onFocus={() => setFocusedField('institution')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.phdInstitution && (
              <span className="text-red-500 text-sm">{errors.phdInstitution.message}</span>
            )}
          </div>

          {/* Major */}
          <div className={getFieldStyle('major', 3)}>
            <input type="hidden" {...register('phdMajor')} value={selectedPhdMajor?.label || ''} />
            <SelectPopover
              items={phdMajors}
              selectedItem={selectedPhdMajor}
              setSelectedItem={handlePhdMajorSelect}
              label="التخصص"
              onFocus={() => setFocusedField('major')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.phdMajor && (
              <span className="text-red-500 text-sm">{errors.phdMajor.message}</span>
            )}
          </div>

          {/* Year of Completion */}
          <div className={getFieldStyle('year', 3)}>
            <input type="hidden" {...register('phdCompletionYear')} value={selectedPhdYear?.value || ''} />
            <SelectPopover
              items={generateCompletionYears()}
              selectedItem={selectedPhdYear}
              setSelectedItem={handlePhdYearSelect}
              label="السنة"
              onFocus={() => setFocusedField('year')}
              onBlur={() => setFocusedField(null)}
            />
            {errors.phdCompletionYear && (
              <span className="text-red-500 text-sm">{errors.phdCompletionYear.message}</span>
            )}
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
          steps={phdSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default PhD; 