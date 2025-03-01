'use client';
import { useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { InformationSchema } from "./validation";
import { AnimatedHierarchicalSelect, SelectionStep } from "../../atom/hierarchical-select";
import { Option } from "../../atom/auto-complete";

interface LocationProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

// Sample location data in the same format as auto-location.tsx
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

// Sample states/provinces by country
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

// Sample localities (larger city areas) by state
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

// Sample admin units (smaller administrative divisions) by locality
const ADMIN_UNITS: Record<string, Option[]> = {
  "khartoum_locality": [
    { value: "khartoum_downtown", label: "وسط الخرطوم" },
    { value: "khartoum_east", label: "شرق الخرطوم" },
    { value: "khartoum_south", label: "جنوب الخرطوم" }
  ],
  "omdurman_locality": [
    { value: "omdurman_central", label: "وسط أم درمان" },
    { value: "omdurman_north", label: "شمال أم درمان" },
    { value: "karari", label: "كرري" }
  ],
  "cairo_east": [
    { value: "nasr_city", label: "مدينة نصر" },
    { value: "heliopolis", label: "مصر الجديدة" },
    { value: "maadi", label: "المعادي" }
  ],
  "riyadh_city_area": [
    { value: "olaya_district", label: "حي العليا" },
    { value: "malaz_district", label: "حي الملز" },
    { value: "sulaimaniyah_district", label: "حي السليمانية" }
  ],
  // Additional admin units for other localities would be included here
};

// Sample neighborhoods by admin unit
const NEIGHBORHOODS: Record<string, Option[]> = {
  "khartoum_downtown": [
    { value: "almogran", label: "المقرن" },
    { value: "riyadh_khartoum", label: "الرياض" },
    { value: "alshaheed", label: "الشهيد" }
  ],
  "khartoum_east": [
    { value: "alsahafa", label: "الصحافة" },
    { value: "burri", label: "بري" },
    { value: "almamoura", label: "المعمورة" }
  ],
  "nasr_city": [
    { value: "first_zone", label: "المنطقة الأولى" },
    { value: "seventh_zone", label: "المنطقة السابعة" },
    { value: "eighth_zone", label: "المنطقة الثامنة" }
  ],
  "olaya_district": [
    { value: "olaya_north", label: "العليا الشمالية" },
    { value: "olaya_center", label: "وسط العليا" },
    { value: "olaya_south", label: "العليا الجنوبية" }
  ],
  // Additional neighborhoods for other admin units would be included here
};

const Location = ({
  register,
  errors,
  setValue
}: LocationProps) => {
  // Define the hierarchical steps
  const locationSteps: SelectionStep[] = [
    {
      id: "country",
      title: "العنوان",
      placeholder: "اختر الدولة",
      emptyMessage: "لا توجد دول متاحة",
      getOptions: () => COUNTRIES
    },
    {
      id: "state",
      title: "الولاية",
      placeholder: "اختر الولاية",
      emptyMessage: "لا توجد محافظات متاحة",
      getOptions: (prev) => {
        const countryId = prev.country?.value;
        return countryId ? (STATES[countryId] || []) : [];
      }
    },
    {
      id: "locality",
      title: "المنطقة",
      placeholder: "اختر المنطقة",
      emptyMessage: "لا توجد مناطق متاحة",
      getOptions: (prev) => {
        const stateId = prev.state?.value;
        return stateId ? (LOCALITIES[stateId] || []) : [];
      }
    },
    {
      id: "admin_unit",
      title: "الوحدة",
      placeholder: "اختر الوحدة",
      emptyMessage: "لا توجد وحدات متاحة",
      getOptions: (prev) => {
        const localityId = prev.locality?.value;
        return localityId ? (ADMIN_UNITS[localityId] || []) : [];
      }
    },
    {
      id: "neighborhood",
      title: "الحي",
      placeholder: "اختر الحي",
      emptyMessage: "لا توجد أحياء متاحة",
      getOptions: (prev) => {
        const adminUnitId = prev.admin_unit?.value;
        return adminUnitId ? (NEIGHBORHOODS[adminUnitId] || []) : [];
      }
    }
  ];

  // Register all fields required by React Hook Form
  useEffect(() => {
    register('currentCountry', { required: "يرجى اختيار الدولة" });
    register('currentState', { required: "يرجى اختيار الولاية" });
    register('currentLocality', { required: "يرجى اختيار المنطقة" });
    register('currentAdminUnit', { required: "يرجى اختيار الوحدة" });
    register('currentNeighborhood', { required: "يرجى اختيار الحي" });
  }, [register]);

  // Handle completion of the hierarchical selection
  const handleComplete = (selections: Record<string, Option>) => {
    // Map the selections to the form values
    setValue('currentCountry', selections.country.label);
    setValue('currentState', selections.state.label);
    setValue('currentLocality', selections.locality.label);
    setValue('currentAdminUnit', selections.admin_unit.label);
    setValue('currentNeighborhood', selections.neighborhood.label);
  };

  // Custom animation timing configurations
  const timing = {
    transitionDelay: 250,
    dropdownDelay: 600
  };

  return (
    <div className="w-full">
      {/* AnimatedHierarchicalSelect component with improved z-index and positioning */}
      <div className="relative" style={{ 
        zIndex: 50,
        position: "relative",
        isolation: "isolate" 
      }}>
        <AnimatedHierarchicalSelect 
          steps={locationSteps} 
          onComplete={handleComplete}
          timing={timing}
          className="w-full"
        />
      </div>
      
      {/* Display validation errors */}
      {(errors.currentCountry || errors.currentState || errors.currentLocality ||
        errors.currentAdminUnit || errors.currentNeighborhood) && (
        <div className="text-red-500 text-sm mt-1">
          يرجى إكمال بيانات السكن
        </div>
      )}
    </div>
  );
};

export default Location; 