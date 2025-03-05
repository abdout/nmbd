'use client';
import { useEffect, useRef } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InformationSchema } from "./validation";
import { AnimatedHierarchicalSelect, SelectionStep } from "../../atom/hierarchical-select";
import { Option } from "../../atom/auto-complete";
import { toast } from "sonner";

interface BirthdateProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  watch?: UseFormWatch<InformationSchema>;
  defaultValues?: Partial<InformationSchema>;
}

// Reuse the same country data structure as in location component
const COUNTRIES: Option[] = [
  { value: "sudan", label: "السودان" },
  { value: "egypt", label: "مصر" },
  { value: "saudi_arabia", label: "السعودية" },
  { value: "jordan", label: "الأردن" },
  { value: "libya", label: "ليبيا" },
  { value: "south_sudan", label: "جنوب السودان" },
  { value: "eritrea", label: "إريتريا" },
  { value: "yemen", label: "اليمن" },
];

// Reuse the same states data structure
const STATES: Record<string, Option[]> = {
  "sudan": [
    { value: "khartoum_state", label: " الخرطوم" },
    { value: "river_nile", label: "نهر النيل" },
    { value: "kassala", label: "كسلا" }
  ],
  "egypt": [
    { value: "cairo_gov", label: "محافظة القاهرة" },
    { value: "alexandria_gov", label: "محافظة الإسكندرية" },
    { value: "luxor_gov", label: "محافظة الأقصر" }
  ],
  "saudi_arabia": [
    { value: "riyadh_province", label: "منطقة الرياض" },
    { value: "makkah_province", label: "منطقة مكة المكرمة" },
    { value: "eastern_province", label: "المنطقة الشرقية" }
  ],
  "jordan": [
    { value: "amman_gov", label: "محافظة عمان" },
    { value: "zarqa_gov", label: "محافظة الزرقاء" },
    { value: "irbid_gov", label: "محافظة إربد" }
  ],
  "libya": [
    { value: "tripoli_gov", label: "محافظة طرابلس" },
    { value: "benghazi_gov", label: "محافظة بنغازي" },
    { value: "misrata_gov", label: "محافظة مصراتة" }
  ],
  "south_sudan": [
    { value: "central_equatoria", label: "ولاية الاستوائية الوسطى" },
    { value: "jonglei", label: "ولاية جونقلي" },
    { value: "unity", label: "ولاية الوحدة" }
  ],
  "eritrea": [
    { value: "maekel", label: "إقليم ماكل" },
    { value: "anseba", label: "إقليم عنسبا" },
    { value: "gash_barka", label: "إقليم قاش بركة" }
  ],
  "yemen": [
    { value: "sanaa_gov", label: "محافظة صنعاء" },
    { value: "aden_gov", label: "محافظة عدن" },
    { value: "taiz_gov", label: "محافظة تعز" }
  ]
};

// Reuse the same localities data structure
const LOCALITIES: Record<string, Option[]> = {
  "khartoum_state": [
    { value: "khartoum_locality", label: "الخرطوم" },
    { value: "omdurman_locality", label: " أم درمان" },
    { value: "bahri_locality", label: "بحري" }
  ],
  "river_nile": [
    { value: "atbara_locality", label: "عطبرة" },
    { value: "damar_locality", label: "الدامر" },
    { value: "shendi_locality", label: "شندي" }
  ],
  "cairo_gov": [
    { value: "cairo_east", label: "القاهرة الشرقية" },
    { value: "cairo_west", label: "القاهرة الغربية" },
    { value: "cairo_central", label: "وسط القاهرة" }
  ],
  "riyadh_province": [
    { value: "riyadh_city_area", label: "منطقة مدينة الرياض" },
    { value: "diriyah_area", label: "منطقة الدرعية" },
    { value: "kharj_area", label: "منطقة الخرج" }
  ],
  // Additional localities for other states would be included here
};

// Generate birth years (100 years from current year)
const generateBirthYears = (): Option[] => {
  return Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });
};

// Birth months with Arabic names
const BIRTH_MONTHS: Option[] = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "ابريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "اغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "اكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" }
];

const Birthdate = ({
  register,
  errors,
  setValue,
  watch,
  defaultValues,
}: BirthdateProps) => {
  // Add ref for the birthdate section
  const birthdateRef = useRef<HTMLDivElement>(null);

  // Watch for validation errors
  useEffect(() => {
    if (errors.birthCountry || errors.birthState || errors.birthLocality ||
        errors.birthYear || errors.birthMonth) {
      
      // Check if any previous birthdate data exists
      const hasExistingData = 
        // Check for country, state, locality (string fields)
        (defaultValues?.birthCountry && defaultValues.birthCountry.length > 0) ||
        (defaultValues?.birthState && defaultValues.birthState.length > 0) ||
        (defaultValues?.birthLocality && defaultValues.birthLocality.length > 0) ||
        
        // Check for year and month which could be numbers or strings
        (defaultValues?.birthYear != null && defaultValues?.birthYear !== '') ||
        (defaultValues?.birthMonth != null && defaultValues?.birthMonth !== '');
      
      // Watch current values if watch function is provided
      const currentCountry = watch ? watch('birthCountry') : '';
      const currentState = watch ? watch('birthState') : '';
      const currentLocality = watch ? watch('birthLocality') : '';
      
      // Safely get year and month as strings (could be numbers or strings)
      const currentYear = watch ? (watch('birthYear') != null ? String(watch('birthYear')) : '') : '';
      const currentMonth = watch ? (watch('birthMonth') != null ? String(watch('birthMonth')) : '') : '';
      
      // Check if user has entered any data in the current session
      const hasCurrentData = 
        (typeof currentCountry === 'string' && currentCountry.length > 0) ||
        (typeof currentState === 'string' && currentState.length > 0) ||
        (typeof currentLocality === 'string' && currentLocality.length > 0) ||
        (currentYear && currentYear.length > 0) ||
        (currentMonth && currentMonth.length > 0);
      
      // Only show error toast if no previous or current data exists
      if (!hasExistingData && !hasCurrentData) {
        // Show error in toast
        toast.error("يرجى إكمال بيانات تاريخ الميلاد", {
          style: {
            background: 'rgb(239 68 68)',
            color: 'white',
            border: 'none'
          }
        });
        
        // Scroll to birthdate section
        if (birthdateRef.current) {
          birthdateRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [errors.birthCountry, errors.birthState, errors.birthLocality,
      errors.birthYear, errors.birthMonth, defaultValues, watch]);

  // Define the hierarchical steps
  const birthdateSteps: SelectionStep[] = [
    {
      id: "country",
      title: "الميلاد",
      placeholder: "اختر دولة الميلاد",
      emptyMessage: "لا توجد دول متاحة",
      getOptions: () => COUNTRIES
    },
    {
      id: "state",
      title: "ولاية الميلاد",
      placeholder: "اختر ولاية الميلاد",
      emptyMessage: "لا توجد ولايات متاحة",
      getOptions: (prev) => {
        const countryId = prev.country?.value;
        return countryId ? (STATES[countryId] || []) : [];
      }
    },
    {
      id: "locality",
      title: "محلية الميلاد",
      placeholder: "اختر محلية الميلاد",
      emptyMessage: "لا توجد محليات متاحة",
      getOptions: (prev) => {
        const stateId = prev.state?.value;
        return stateId ? (LOCALITIES[stateId] || []) : [];
      }
    },
    {
      id: "year",
      title: "سنة الميلاد",
      placeholder: "اختر سنة الميلاد",
      emptyMessage: "لا توجد سنوات متاحة",
      getOptions: () => generateBirthYears()
    },
    {
      id: "month",
      title: "شهر الميلاد",
      placeholder: "اختر شهر الميلاد",
      emptyMessage: "لا توجد شهور متاحة",
      getOptions: () => BIRTH_MONTHS
    }
  ];

  // Register all fields required by React Hook Form
  useEffect(() => {
    // Check if any previous data exists to determine if fields should be required
    const hasExistingData = 
      (defaultValues?.birthCountry && defaultValues.birthCountry.length > 0) ||
      (defaultValues?.birthState && defaultValues.birthState.length > 0) ||
      (defaultValues?.birthLocality && defaultValues.birthLocality.length > 0) ||
      // Check for year and month which could be numbers or strings
      (defaultValues?.birthYear != null && defaultValues?.birthYear !== '') ||
      (defaultValues?.birthMonth != null && defaultValues?.birthMonth !== '');
    
    // Debug output to help troubleshoot
    console.log('Birthdate existing data:', {
      hasExistingData,
      birthYear: defaultValues?.birthYear,
      birthYearType: defaultValues?.birthYear ? typeof defaultValues.birthYear : 'undefined',
      birthMonth: defaultValues?.birthMonth,
      birthMonthType: defaultValues?.birthMonth ? typeof defaultValues.birthMonth : 'undefined'
    });
    
    if (!hasExistingData) {
      // Only make fields required if there's no existing data
      register('birthCountry', { required: "يرجى اختيار دولة الميلاد" });
      register('birthState', { required: "يرجى اختيار ولاية الميلاد" });
      register('birthLocality', { required: "يرجى اختيار محلية الميلاد" });
      register('birthYear', { required: "يرجى اختيار سنة الميلاد" });
      register('birthMonth', { required: "يرجى اختيار شهر الميلاد" });
    } else {
      // Register fields as optional if there's existing data
      register('birthCountry');
      register('birthState');
      register('birthLocality');
      register('birthYear');
      register('birthMonth');
    }
  }, [register, defaultValues]);

  // Handle completion of the hierarchical selection
  const handleComplete = (selections: Record<string, Option>) => {
    try {
      // Map the selections to the form values
      setValue('birthCountry', selections.country.label);
      setValue('birthState', selections.state.label);
      setValue('birthLocality', selections.locality.label);
      
      // Make sure year and month are stored with consistent types
      // Using string for consistency with form validation
      if (selections.year && selections.year.value) {
        setValue('birthYear', selections.year.value.toString());
      }
      
      if (selections.month && selections.month.value) {
        setValue('birthMonth', selections.month.value.toString());
      }
      
      console.log('Set birthdate values:', {
        country: selections.country.label,
        state: selections.state.label,
        locality: selections.locality.label,
        year: selections.year.value.toString(),
        month: selections.month.value.toString()
      });
    } catch (error) {
      console.error('Error in handleComplete:', error);
    }
  };

  // Custom animation timing configurations
  const timing = {
    transitionDelay: 250,
    dropdownDelay: 600
  };

  return (
    <div className="w-full" ref={birthdateRef}>
      {/* AnimatedHierarchicalSelect component with improved z-index and positioning */}
      <div className="relative" style={{ 
        zIndex: 50,
        position: "relative",
        isolation: "isolate" 
      }}>
        <AnimatedHierarchicalSelect 
          steps={birthdateSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
          isLastStep={true}
        />
      </div>
    </div>
  );
};

export default Birthdate; 