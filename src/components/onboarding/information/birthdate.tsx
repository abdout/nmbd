'use client';
import { useEffect, useRef } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import { AnimatedHierarchicalSelect, SelectionStep } from "../../atom/hierarchical-select";
import { Option } from "../../atom/auto-complete";
import { toast } from "sonner";

interface BirthdateProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
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
    { value: "khartoum_state", label: "ولاية الخرطوم" },
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
    { value: "khartoum_locality", label: "محلية الخرطوم" },
    { value: "omdurman_locality", label: "محلية أم درمان" },
    { value: "bahri_locality", label: "محلية بحري" }
  ],
  "river_nile": [
    { value: "atbara_locality", label: "محلية عطبرة" },
    { value: "damar_locality", label: "محلية الدامر" },
    { value: "shendi_locality", label: "محلية شندي" }
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
}: BirthdateProps) => {
  // Add ref for the birthdate section
  const birthdateRef = useRef<HTMLDivElement>(null);

  // Watch for validation errors
  useEffect(() => {
    if (errors.birthCountry || errors.birthState || errors.birthLocality ||
        errors.birthYear || errors.birthMonth) {
      // Show error in toast
      toast.error("يرجى إكمال بيانات تاريخ الميلاد");
      
      // Scroll to birthdate section
      if (birthdateRef.current) {
        birthdateRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [errors.birthCountry, errors.birthState, errors.birthLocality,
      errors.birthYear, errors.birthMonth]);

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
    register('birthCountry', { required: "يرجى اختيار دولة الميلاد" });
    register('birthState', { required: "يرجى اختيار ولاية الميلاد" });
    register('birthLocality', { required: "يرجى اختيار محلية الميلاد" });
    register('birthYear', { required: "يرجى اختيار سنة الميلاد" });
    register('birthMonth', { required: "يرجى اختيار شهر الميلاد" });
  }, [register]);

  // Handle completion of the hierarchical selection
  const handleComplete = (selections: Record<string, Option>) => {
    // Map the selections to the form values
    setValue('birthCountry', selections.country.label);
    setValue('birthState', selections.state.label);
    setValue('birthLocality', selections.locality.label);
    setValue('birthYear', selections.year.value);
    setValue('birthMonth', selections.month.value);
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
        />
      </div>
      
      {/* Display validation errors */}
      {(errors.birthCountry || errors.birthState || errors.birthLocality ||
        errors.birthYear || errors.birthMonth) && (
        <div className="text-red-500 text-sm mt-1">
          يرجى إكمال بيانات الميلاد
        </div>
      )}
    </div>
  );
};

export default Birthdate; 