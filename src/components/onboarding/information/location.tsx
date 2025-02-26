'use client';
import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";

interface LocationProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Location = ({
  register,
  errors,
  setValue
}: LocationProps) => {
  // Current Location step state
  const [currentLocationStep, setCurrentLocationStep] = useState<number>(1);
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState<Item | null>(null);
  const [selectedCurrentState, setSelectedCurrentState] = useState<Item | null>(null);
  const [selectedCurrentLocality, setSelectedCurrentLocality] = useState<Item | null>(null);
  const [selectedCurrentAdminUnit, setSelectedCurrentAdminUnit] = useState<Item | null>(null);
  const [selectedCurrentNeighborhood, setSelectedCurrentNeighborhood] = useState<Item | null>(null);

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

  const adminUnits: Record<string, Item[]> = {
    OMD: [
      { label: 'الخرطوم وسط', value: 'KC' },
    ],
    NS: [
      { label: 'النصر', value: 'NR' },
    ],
  };

  const neighborhoods: Record<string, Item[]> = {
    KC: [
      { label: 'حي القصر', value: 'GSR' },
    ],
    NR: [
      { label: 'حي النصر', value: 'NSR' },
    ],
  };

  // Function to get the appropriate location field label for display
  const getLocationStepLabel = (step: number): string => {
    switch (step) {
      case 1: return "السكن";
      case 2: return "الولاية";
      case 3: return "المدينة";
      case 4: return "الوحدة الإدارية";
      case 5: return "الحي";
      default: return "السكن";
    }
  };

  // Handle selection for current location fields
  const handleCurrentLocationSelect = (fieldName: string, item: Item | null) => {
    // Update form values when an item is selected
    if (item) {
      setValue(fieldName as any, item.label);
    } else {
      setValue(fieldName as any, '');
    }

    // Update step state based on the field being updated
    switch (fieldName) {
      case 'currentCountry':
        setSelectedCurrentCountry(item);
        if (item) setCurrentLocationStep(2);
        break;
      case 'currentState':
        setSelectedCurrentState(item);
        if (item) setCurrentLocationStep(3);
        break;
      case 'currentLocality':
        setSelectedCurrentLocality(item);
        if (item) setCurrentLocationStep(4);
        break;
      case 'currentAdminUnit':
        setSelectedCurrentAdminUnit(item);
        if (item) setCurrentLocationStep(5);
        break;
      case 'currentNeighborhood':
        setSelectedCurrentNeighborhood(item);
        if (item) setCurrentLocationStep(6); // Move to a completion step
        break;
    }
  };

  // Function to reset location selection
  const resetLocationSelection = () => {
    setCurrentLocationStep(1);
    setSelectedCurrentCountry(null);
    setSelectedCurrentState(null);
    setSelectedCurrentLocality(null);
    setSelectedCurrentAdminUnit(null);
    setSelectedCurrentNeighborhood(null);
    setValue('currentCountry', '');
    setValue('currentState', '');
    setValue('currentLocality', '');
    setValue('currentAdminUnit', '');
    setValue('currentNeighborhood', '');
  };

  return (
    <div className="">
      {/* Hidden inputs to store values */}
      <input type="hidden" {...register('currentCountry')} value={selectedCurrentCountry?.label || ''} />
      <input type="hidden" {...register('currentState')} value={selectedCurrentState?.label || ''} />
      <input type="hidden" {...register('currentLocality')} value={selectedCurrentLocality?.label || ''} />
      <input type="hidden" {...register('currentAdminUnit')} value={selectedCurrentAdminUnit?.label || ''} />
      <input type="hidden" {...register('currentNeighborhood')} value={selectedCurrentNeighborhood?.label || ''} />

      {/* Show the current step popover */}
      {Number(currentLocationStep) === 1 && (
        <div className="relative">
          <SelectPopover
            items={countries}
            selectedItem={selectedCurrentCountry}
            setSelectedItem={(item) => handleCurrentLocationSelect('currentCountry', item)}
            label={getLocationStepLabel(currentLocationStep)}
          />
        </div>
      )}

      {Number(currentLocationStep) === 2 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetLocationSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={selectedCurrentCountry ? states[selectedCurrentCountry.value] || [] : []}
            selectedItem={selectedCurrentState}
            setSelectedItem={(item) => handleCurrentLocationSelect('currentState', item)}
            label={getLocationStepLabel(currentLocationStep)}
          />
        </div>
      )}

      {Number(currentLocationStep) === 3 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetLocationSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={selectedCurrentState ? localities[selectedCurrentState.value] || [] : []}
            selectedItem={selectedCurrentLocality}
            setSelectedItem={(item) => handleCurrentLocationSelect('currentLocality', item)}
            label={getLocationStepLabel(currentLocationStep)}
          />
        </div>
      )}

      {Number(currentLocationStep) === 4 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetLocationSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={selectedCurrentLocality ? adminUnits[selectedCurrentLocality.value] || [] : []}
            selectedItem={selectedCurrentAdminUnit}
            setSelectedItem={(item) => handleCurrentLocationSelect('currentAdminUnit', item)}
            label={getLocationStepLabel(currentLocationStep)}
          />
        </div>
      )}

      {Number(currentLocationStep) === 5 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetLocationSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          </div>
          <SelectPopover
            items={selectedCurrentAdminUnit ? neighborhoods[selectedCurrentAdminUnit.value] || [] : []}
            selectedItem={selectedCurrentNeighborhood}
            setSelectedItem={(item) => handleCurrentLocationSelect('currentNeighborhood', item)}
            label={getLocationStepLabel(currentLocationStep)}
          />
        </div>
      )}

      {Number(currentLocationStep) === 6 && (
        <div className="relative">
          <div className="absolute right-[8.7rem] top-[7px] z-10">
            <button
              type="button"
              onClick={resetLocationSelection}
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
            selectedItem={selectedCurrentNeighborhood}
            setSelectedItem={() => {}} // No action needed on selection
            label={selectedCurrentNeighborhood?.label || "الحي"}
          />
        </div>
      )}

      {/* Show any validation errors */}
      {(errors.currentCountry || errors.currentState || errors.currentLocality ||
        errors.currentAdminUnit || errors.currentNeighborhood) && (
          <div className="text-red-500 text-sm mt-2">
            يرجى إكمال بيانات السكن
          </div>
        )}
    </div>
  );
};

export default Location; 