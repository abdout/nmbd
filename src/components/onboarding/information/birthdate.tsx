'use client';
import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover from "@/components/atom/popover/popover";

interface Item {
  label: string;
  value: string;
}

interface BirthdateProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Birthdate = ({
  register,
  errors,
  setValue
}: BirthdateProps) => {
  // Birth Information step state
  const [birthInfoStep, setBirthInfoStep] = useState<number>(1);
  const [selectedBirthCountry, setSelectedBirthCountry] = useState<Item | null>(null);
  const [selectedBirthState, setSelectedBirthState] = useState<Item | null>(null);
  const [selectedBirthLocality, setSelectedBirthLocality] = useState<Item | null>(null);
  const [selectedBirthYear, setSelectedBirthYear] = useState<Item | null>(null);
  const [selectedBirthMonth, setSelectedBirthMonth] = useState<Item | null>(null);

  // Options data for location fields
  const countries: Item[] = [
    { label: 'السودان', value: 'SD' },
    { label: 'مصر', value: 'EG' },
    { label: 'السعودية', value: 'SA' },
    { label: 'الامارات', value: 'AE' },
  ];

  const states: Record<string, Item[]> = {
    SD: [
      { label: 'الخرطوم', value: 'KH' },
      { label: 'الجزيرة', value: 'GZ' },
      { label: 'نهر النيل', value: 'NR' },
    ],
    EG: [
      { label: 'القاهرة', value: 'CA' },
      { label: 'الإسكندرية', value: 'AL' },
      { label: 'أسيوط', value: 'AS' },
    ],
    SA: [
      { label: 'الرياض', value: 'RI' },
      { label: 'مكة', value: 'MK' },
    ],
    AE: [
      { label: 'دبي', value: 'DU' },
      { label: 'أبوظبي', value: 'AD' },
    ],
  };

  const localities: Record<string, Item[]> = {
    KH: [
      { label: 'أم درمان', value: 'OMD' },
      { label: 'بحري', value: 'BH' },
    ],
    CA: [
      { label: 'مدينة نصر', value: 'NS' },
      { label: 'الزمالك', value: 'ZM' },
    ],
  };

  // Data options for birth information
  const birthYears: Item[] = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  });

  const birthMonths: Item[] = [
    { label: 'يناير', value: '1' },
    { label: 'فبراير', value: '2' },
    { label: 'مارس', value: '3' },
    { label: 'ابريل', value: '4' },
    { label: 'مايو', value: '5' },
    { label: 'يونيو', value: '6' },
    { label: 'يوليو', value: '7' },
    { label: 'اغسطس', value: '8' },
    { label: 'سبتمبر', value: '9' },
    { label: 'اكتوبر', value: '10' },
    { label: 'نوفمبر', value: '11' },
    { label: 'ديسمبر', value: '12' },
  ];

  // Function to get birth information field label
  const getBirthInfoStepLabel = (step: number): string => {
    switch (step) {
      case 1: return "الميلاد";
      case 2: return "ولاية الميلاد";
      case 3: return "محلية الميلاد";
      case 4: return "سنة الميلاد";
      case 5: return "شهر الميلاد";
      default: return "معلومات الميلاد";
    }
  };

  // Handle selection for birth information fields
  const handleBirthInfoSelect = (fieldName: string, item: Item | null) => {
    // Update form values when an item is selected
    if (item) {
      setValue(fieldName as any, item.label);
    } else {
      setValue(fieldName as any, '');
    }

    // Update step state based on the field being updated
    switch (fieldName) {
      case 'birthCountry':
        setSelectedBirthCountry(item);
        if (item) setBirthInfoStep(2);
        break;
      case 'birthState':
        setSelectedBirthState(item);
        if (item) setBirthInfoStep(3);
        break;
      case 'birthLocality':
        setSelectedBirthLocality(item);
        if (item) setBirthInfoStep(4);
        break;
      case 'birthYear':
        setSelectedBirthYear(item);
        if (item) setBirthInfoStep(5);
        break;
      case 'birthMonth':
        setSelectedBirthMonth(item);
        if (item) setBirthInfoStep(6); // Move to completion step
        break;
    }
  };

  // Function to reset birth information selection
  const resetBirthInfoSelection = () => {
    setBirthInfoStep(1);
    setSelectedBirthCountry(null);
    setSelectedBirthState(null);
    setSelectedBirthLocality(null);
    setSelectedBirthYear(null);
    setSelectedBirthMonth(null);
    setValue('birthCountry', '');
    setValue('birthState', '');
    setValue('birthLocality', '');
    setValue('birthYear', '');
    setValue('birthMonth', '');
  };

  return (
    <div className="">
      {/* Hidden inputs to store values */}
      <input type="hidden" {...register('birthCountry')} value={selectedBirthCountry?.label || ''} />
      <input type="hidden" {...register('birthState')} value={selectedBirthState?.label || ''} />
      <input type="hidden" {...register('birthLocality')} value={selectedBirthLocality?.label || ''} />
      <input type="hidden" {...register('birthYear')} value={selectedBirthYear?.label || ''} />
      <input type="hidden" {...register('birthMonth')} value={selectedBirthMonth?.label || ''} />

      {/* Show the current step popover */}
      {Number(birthInfoStep) === 1 && (
        <div className="relative">
          <SelectPopover
            items={countries}
            selectedItem={selectedBirthCountry}
            setSelectedItem={(item) => handleBirthInfoSelect('birthCountry', item)}
            label={getBirthInfoStepLabel(birthInfoStep)}
          />
        </div>
      )}

      {Number(birthInfoStep) === 2 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetBirthInfoSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={selectedBirthCountry ? states[selectedBirthCountry.value] || [] : []}
            selectedItem={selectedBirthState}
            setSelectedItem={(item) => handleBirthInfoSelect('birthState', item)}
            label={getBirthInfoStepLabel(birthInfoStep)}
          />
        </div>
      )}

      {Number(birthInfoStep) === 3 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetBirthInfoSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={selectedBirthState ? localities[selectedBirthState.value] || [] : []}
            selectedItem={selectedBirthLocality}
            setSelectedItem={(item) => handleBirthInfoSelect('birthLocality', item)}
            label={getBirthInfoStepLabel(birthInfoStep)}
          />
        </div>
      )}

      {Number(birthInfoStep) === 4 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetBirthInfoSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={birthYears}
            selectedItem={selectedBirthYear}
            setSelectedItem={(item) => handleBirthInfoSelect('birthYear', item)}
            label={getBirthInfoStepLabel(birthInfoStep)}
          />
        </div>
      )}

      {Number(birthInfoStep) === 5 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetBirthInfoSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={birthMonths}
            selectedItem={selectedBirthMonth}
            setSelectedItem={(item) => handleBirthInfoSelect('birthMonth', item)}
            label={getBirthInfoStepLabel(birthInfoStep)}
          />
        </div>
      )}

      {Number(birthInfoStep) === 6 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetBirthInfoSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={[]} // Empty items as this is the final selection
            selectedItem={selectedBirthMonth}
            setSelectedItem={() => {}} // No action needed on selection
            label={selectedBirthMonth?.label || "شهر الميلاد"}
          />
        </div>
      )}

      {/* Show any validation errors */}
      {(errors.birthCountry || errors.birthState || errors.birthLocality ||
        errors.birthYear || errors.birthMonth) && (
          <div className="text-red-500 text-sm mt-2">
            يرجى إكمال بيانات الميلاد
          </div>
        )}
    </div>
  );
};

export default Birthdate; 