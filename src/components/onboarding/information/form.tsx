"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { informationSchema } from "./validation";
import { createInformation, updateInformation } from "./action";
import { INFORMATION_FIELDS } from "./constants";
import type { InformationSchema } from "./validation";
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectPopover from "@/components/atom/popover/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Item {
  label: string;
  value: string;
}

interface FormProps {
  type: "create" | "update";
  data?: InformationSchema;
}

const InformationForm = ({ type, data }: FormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCountry, setSelectedCountry] = useState<Item | null>(null);
  const [selectedState, setSelectedState] = useState<Item | null>(null);
  const [selectedCity, setSelectedCity] = useState<Item | null>(null);
  const { formRef, setIsSubmitting, setCurrentFormId } = useFormContext();

  // Current Location step state
  const [currentLocationStep, setCurrentLocationStep] = useState<number>(1);
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState<Item | null>(null);
  const [selectedCurrentState, setSelectedCurrentState] = useState<Item | null>(null);
  const [selectedCurrentLocality, setSelectedCurrentLocality] = useState<Item | null>(null);
  const [selectedCurrentAdminUnit, setSelectedCurrentAdminUnit] = useState<Item | null>(null);
  const [selectedCurrentNeighborhood, setSelectedCurrentNeighborhood] = useState<Item | null>(null);

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InformationSchema>({
    resolver: zodResolver(informationSchema),
    defaultValues: data,
  });

  useEffect(() => {
    setCurrentFormId('information');
    // Set education level to student as default and update form value
    setValue('educationLevel', 'student');
  }, [setCurrentFormId, setValue]);

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

  // Function to handle going back to a previous step
  const handleLocationStepBack = (step: number) => {
    setCurrentLocationStep(step);
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

  const onSubmit = handleSubmit((formData) => {
    startTransition(async () => {
      try {
        setIsSubmitting?.(true);

        // Include all fields from the form data to ensure all data is saved to the database
        // For numeric fields that need to be integers in the database, we'll handle them separately
        const minimalData = {
          ...formData, // Include all fields from the form
          // We'll let the server actions handle the conversion
        };

        console.log("Submitting minimal data:", minimalData);

        const initialState = { success: false, error: false };

        if (type === "create") {
          const result = await createInformation(initialState, minimalData);

          if (result.success) {
            toast.success("Information created successfully!");
            router.push(getNextRoute(pathname));
          } else {
            toast.error("Failed to create information");
          }
        } else {
          const result = await updateInformation(initialState, minimalData);

          if (result.success) {
            toast.success("Information updated successfully!");
            router.push(getNextRoute(pathname));
          } else {
            toast.error("Failed to update information");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An error occurred while submitting the form");
      } finally {
        setIsSubmitting?.(false);
      }
    });
  });

  // education level state
  const [educationLevel, setEducationLevel] = useState<string>('student');
  const [selectedInstitution, setSelectedInstitution] = useState<Item | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Item | null>(null);
  const [selectedStudentYear, setSelectedStudentYear] = useState<Item | null>(null);
  const [selectedGraduationYear, setSelectedGraduationYear] = useState<Item | null>(null);
  const [selectedBachelorInstitution, setSelectedBachelorInstitution] = useState<Item | null>(null);
  const [selectedBachelorMajor, setSelectedBachelorMajor] = useState<Item | null>(null);
  const [selectedBachelorYear, setSelectedBachelorYear] = useState<Item | null>(null);
  const [selectedMasterInstitution, setSelectedMasterInstitution] = useState<Item | null>(null);
  const [selectedMasterMajor, setSelectedMasterMajor] = useState<Item | null>(null);
  const [selectedMasterYear, setSelectedMasterYear] = useState<Item | null>(null);

  // PhD education state
  const [selectedPhdInstitution, setSelectedPhdInstitution] = useState<Item | null>(null);
  const [selectedPhdMajor, setSelectedPhdMajor] = useState<Item | null>(null);
  const [selectedPhdYear, setSelectedPhdYear] = useState<Item | null>(null);

  // education level options
  const studentYears: Item[] = Array.from({ length: 10 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const graduationYears: Item[] = Array.from({ length: 70 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  });

  const institutions: Item[] = [
    { label: 'الجامعة السودانية', value: 'JS' },
    { label: 'الجامعة المصرية', value: 'MS' },
    { label: 'الجامعة السعودية', value: 'SA' },
    { label: 'الجامعة الإماراتية', value: 'AE' },
  ];

  const majors: Item[] = [
    { label: 'علوم الحاسب', value: 'CS' },
    { label: 'هندسة الكمبيوتر', value: 'CE' },
    { label: 'هندسة الطيران', value: 'AE' },
    { label: 'هندسة الطب', value: 'MD' },
    { label: 'هندسة الصناعة', value: 'ID' },
    { label: 'هندسة الميكانيك', value: 'ME' },
    { label: 'هندسة الكيمياء', value: 'CH' },
    { label: 'هندسة الإلكترونيات', value: 'EE' },
    { label: 'هندسة الإتصالات', value: 'CS' },
    { label: 'هندسة البناء', value: 'CE' },
  ];

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="h-48 flex flex-col -mt-6"
      noValidate
    >
      <ScrollArea className="h-full w-full">
        <div dir="rtl" className="flex flex-col gap-6 pr-4 ">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="name"
              placeholder="اسم المستخدم"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}

            <Input
              id="fullname"
              placeholder="الاسم الكامل"
              {...register('fullname')}
            />
            {errors.fullname && (
              <span className="text-red-500 text-sm">{errors.fullname.message}</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="w-1/4">
              <Select
                onValueChange={(value) => setValue('maritalStatus', value)}
                defaultValue=""
                dir="rtl"
              >
                <SelectTrigger className="h-9 flex justify-start text-right [&>svg]:hidden" aria-label="الحالة">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
                  <SelectItem value="single">أعزب</SelectItem>
                  <SelectItem value="married">متزوج</SelectItem>
                  <SelectItem value="divorced">مطلق</SelectItem>
                  <SelectItem value="widowed">أرمل</SelectItem>
                </SelectContent>
              </Select>
              {errors.maritalStatus && (
                <span className="text-red-500 text-sm">{errors.maritalStatus.message}</span>
              )}
            </div>
            
            <div className="w-1/4">
              <Select
                onValueChange={(value) => setValue('gender', value)}
                defaultValue=""
                dir="rtl"
              >
                <SelectTrigger className="h-9 flex justify-start text-right [&>svg]:hidden" aria-label="الجنس">
                  <SelectValue placeholder="الجنس" />
                </SelectTrigger>
                <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <span className="text-red-500 text-sm">{errors.gender.message}</span>
              )}
            </div>
            
            <div className="w-1/4">
              <Select
                onValueChange={(value) => setValue('religion', value)}
                defaultValue=""
                dir="rtl"
              >
                <SelectTrigger className="h-9 flex justify-start text-right [&>svg]:hidden" aria-label="الديانة">
                  <SelectValue placeholder="الديانة" />
                </SelectTrigger>
                <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
                  <SelectItem value="islam">الإسلام</SelectItem>
                  <SelectItem value="christianity">المسيحية</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
              {errors.religion && (
                <span className="text-red-500 text-sm">{errors.religion.message}</span>
              )}
            </div>
            
            <div className="w-1/4">
              <Input
                id="nationalityId"
                placeholder="الرقم الوطني"
                className="h-9 text-right"
                dir="rtl"
                {...register('nationalityId')}
              />
              {errors.nationalityId && (
                <span className="text-red-500 text-sm">{errors.nationalityId.message}</span>
              )}
            </div>
          </div>

          {/* Current Location - Updated to use SelectPopover */}
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              {/* Remove the title and edit button */}

              {/* Remove breadcrumb display */}

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

              {/* Remove completion message */}

              {/* Show any validation errors */}
              {(errors.currentCountry || errors.currentState || errors.currentLocality ||
                errors.currentAdminUnit || errors.currentNeighborhood) && (
                  <div className="text-red-500 text-sm mt-2">
                    يرجى إكمال بيانات السكن
                  </div>
                )}
            </div>

            {/* Birth Information - Updated to use SelectPopover */}
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
                    setSelectedItem={() => { }} // No action needed on selection
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
          </div>

          {/* bio */}
          <div className="flex flex-col">
            <Input
              id="bio"
              placeholder="Bio"
              {...register('bio')}

            />
            {errors.bio && (
              <span className="text-red-500 text-sm">{errors.bio.message}</span>
            )}
          </div>

          {/* education */}
          <div dir="rtl" className="flex flex-col">
            <p className="text-sm font-semibold mb-2">الدرجة العلمية:</p>
            <hr className="w-20 h-[1px] bg-black -mt-1 mb-2" />
            <div className="flex justify-between">
              {[
                { id: 'student', label: 'طالب' },
                { id: 'diploma', label: 'دبلوم' },
                { id: 'bachelor', label: 'بكالوريوس' },
                { id: 'master', label: 'ماجستير' },
                { id: 'phd', label: 'دكتوراه' },
                { id: 'professor', label: 'أستاذية' }
              ].map((level) => (
                <Button
                  key={level.id}
                  size='sm'
                  type="button"
                  onClick={() => {
                    setValue('educationLevel', level.id);
                    setEducationLevel(level.id);
                  }}
                  className={`h-6 shadow-none ${educationLevel === level.id ? 'bg-neutral-200' : 'bg-background'} text-black hover:bg-neutral-200 focus:bg-neutral-200`}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Dynamic education fields based on selected level */}
          {educationLevel && (
            <div className="space-y-4">
              {/* Main degree section */}
              <div>
                {/* Title based on education level */}
                <p className="text-sm font-semibold mb-2">
                  {educationLevel === 'professor' && 'بيانات الأستاذية:'}
                  {educationLevel === 'phd' && 'بيانات الدكتوراه:'}
                  {educationLevel === 'master' && 'بيانات الماجستير:'}
                  {educationLevel === 'bachelor' && 'بيانات البكالوريوس:'}
                  {educationLevel === 'diploma' && 'بيانات الدبلوم:'}
                  {educationLevel === 'student' && 'بيانات الدراسة الحالية:'}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Institution selection */}
                  <div className="relative">
                    <input type="hidden" id="institution" name="institution" value={selectedInstitution?.label || ''} />
                    <SelectPopover
                      items={institutions}
                      selectedItem={selectedInstitution}
                      setSelectedItem={(item) => {
                        setSelectedInstitution(item);
                        if (item) {
                          setValue('institution', item.label);
                        }
                      }}
                      label="الجامعة"
                    />
                    {errors.institution && (
                      <span className="text-red-500 text-sm">{errors.institution.message}</span>
                    )}
                  </div>

                  {/* Major/Specialization */}
                  <div className="relative">
                    <input type="hidden" id="major" name="major" value={selectedMajor?.label || ''} />
                    <SelectPopover
                      items={majors}
                      selectedItem={selectedMajor}
                      setSelectedItem={(item) => {
                        setSelectedMajor(item);
                        if (item) {
                          setValue('major', item.label);
                        }
                      }}
                      label="التخصص"
                    />
                    {errors.major && (
                      <span className="text-red-500 text-sm">{errors.major.message}</span>
                    )}
                  </div>

                  {/* Year selection - different based on education level */}
                  {educationLevel === 'student' ? (
                    <div className="relative">
                      <input type="hidden" id="studentYear" name="studentYear" value={selectedStudentYear?.label || ''} />
                      <SelectPopover
                        items={studentYears}
                        selectedItem={selectedStudentYear}
                        setSelectedItem={(item) => {
                          setSelectedStudentYear(item);
                          if (item) {
                            setValue('studentYear', Number(item.value));
                          }
                        }}
                        label="السنة"
                      />
                      {errors.studentYear && (
                        <span className="text-red-500 text-sm">{errors.studentYear.message}</span>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input type="hidden" id="yearOfCompletion" name="yearOfCompletion" value={selectedGraduationYear?.label || ''} />
                      <SelectPopover
                        items={graduationYears}
                        selectedItem={selectedGraduationYear}
                        setSelectedItem={(item) => {
                          setSelectedGraduationYear(item);
                          if (item) {
                            setValue('yearOfCompletion', item.value);
                          }
                        }}
                        label="سنة التخرج"
                      />
                      {errors.yearOfCompletion && (
                        <span className="text-red-500 text-sm">{errors.yearOfCompletion.message}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* PhD section for professor */}
              {educationLevel === 'professor' && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">بيانات الدكتوراه:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* PhD institution */}
                    <div className="relative">
                      <input type="hidden" id="phdInstitution" name="phdInstitution" value={selectedPhdInstitution?.label || ''} />
                      <SelectPopover
                        items={institutions}
                        selectedItem={selectedPhdInstitution}
                        setSelectedItem={(item) => {
                          setSelectedPhdInstitution(item);
                          if (item) {
                            setValue('phdInstitution', item.label);
                          }
                        }}
                        label="الجامعة"
                      />
                    </div>

                    {/* PhD major */}
                    <div className="relative">
                      <input type="hidden" id="phdMajor" name="phdMajor" value={selectedPhdMajor?.label || ''} />
                      <SelectPopover
                        items={majors}
                        selectedItem={selectedPhdMajor}
                        setSelectedItem={(item) => {
                          setSelectedPhdMajor(item);
                          if (item) {
                            setValue('phdMajor', item.label);
                          }
                        }}
                        label="التخصص"
                      />
                    </div>

                    {/* PhD graduation year */}
                    <div className="relative">
                      <input type="hidden" id="phdCompletionYear" name="phdCompletionYear" value={selectedPhdYear?.label || ''} />
                      <SelectPopover
                        items={graduationYears}
                        selectedItem={selectedPhdYear}
                        setSelectedItem={(item) => {
                          setSelectedPhdYear(item);
                          if (item) {
                            setValue('phdCompletionYear', item.value);
                          }
                        }}
                        label="السنة"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Master's section for professor and PhD */}
              {(educationLevel === 'professor' || educationLevel === 'phd') && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">بيانات الماجستير:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Master's institution */}
                    <div className="relative">
                      <input type="hidden" id="masterInstitution" name="masterInstitution" value={selectedMasterInstitution?.label || ''} />
                      <SelectPopover
                        items={institutions}
                        selectedItem={selectedMasterInstitution}
                        setSelectedItem={(item) => {
                          setSelectedMasterInstitution(item);
                          if (item) {
                            setValue('masterInstitution', item.label);
                          }
                        }}
                        label="الجامعة"
                      />
                    </div>

                    {/* Master's major */}
                    <div className="relative">
                      <input type="hidden" id="masterMajor" name="masterMajor" value={selectedMasterMajor?.label || ''} />
                      <SelectPopover
                        items={majors}
                        selectedItem={selectedMasterMajor}
                        setSelectedItem={(item) => {
                          setSelectedMasterMajor(item);
                          if (item) {
                            setValue('masterMajor', item.label);
                          }
                        }}
                        label="التخصص"
                      />
                    </div>

                    {/* Master's graduation year */}
                    <div className="relative">
                      <input type="hidden" id="masterCompletionYear" name="masterCompletionYear" value={selectedMasterYear?.label || ''} />
                      <SelectPopover
                        items={graduationYears}
                        selectedItem={selectedMasterYear}
                        setSelectedItem={(item) => {
                          setSelectedMasterYear(item);
                          if (item) {
                            setValue('masterCompletionYear', item.value);
                          }
                        }}
                        label="السنة"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bachelor's section for degrees above bachelor */}
              {(educationLevel === 'master' || educationLevel === 'phd' || educationLevel === 'professor') && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">بيانات البكالوريوس:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Bachelor's institution */}
                    <div className="relative">
                      <input type="hidden" id="bachelorInstitution" name="bachelorInstitution" value={selectedBachelorInstitution?.label || ''} />
                      <SelectPopover
                        items={institutions}
                        selectedItem={selectedBachelorInstitution}
                        setSelectedItem={(item) => {
                          setSelectedBachelorInstitution(item);
                          if (item) {
                            setValue('bachelorInstitution', item.label);
                          }
                        }}
                        label="الجامعة"
                      />
                    </div>

                    {/* Bachelor's major */}
                    <div className="relative">
                      <input type="hidden" id="bachelorMajor" name="bachelorMajor" value={selectedBachelorMajor?.label || ''} />
                      <SelectPopover
                        items={majors}
                        selectedItem={selectedBachelorMajor}
                        setSelectedItem={(item) => {
                          setSelectedBachelorMajor(item);
                          if (item) {
                            setValue('bachelorMajor', item.label);
                          }
                        }}
                        label="التخصص"
                      />
                    </div>

                    {/* Bachelor's graduation year */}
                    <div className="relative">
                      <input type="hidden" id="bachelorCompletionYear" name="bachelorCompletionYear" value={selectedBachelorYear?.label || ''} />
                      <SelectPopover
                        items={graduationYears}
                        selectedItem={selectedBachelorYear}
                        setSelectedItem={(item) => {
                          setSelectedBachelorYear(item);
                          if (item) {
                            setValue('bachelorCompletionYear', item.value);
                          }
                        }}
                        label="السنة"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Occupation information for non-students */}
          {educationLevel !== 'student' && (
            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-2">الدرجة الوظيفية:</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Current occupation/rank */}
                <div className="relative">
                  <Input
                    id="currentOccupation"
                    placeholder="المنصب الحالي"
                    {...register('currentOccupation')}
                  />
                  {errors.currentOccupation && (
                    <span className="text-red-500 text-sm">{errors.currentOccupation.message}</span>
                  )}
                </div>

                {/* Employment sector */}
                {/* <div className="relative">
                  <Input
                    id="employmentSector"
                    placeholder="القطاع"
                    {...register('employmentSector')}
                  />
                  {errors.employmentSector && (
                    <span className="text-red-500 text-sm">{errors.employmentSector.message}</span>
                  )}
                </div> */}

                {/* Workplace address */}
                <div className="relative">
                  <Input
                    id="workplaceAddress"
                    placeholder="مكان العمل"
                    {...register('workplaceAddress')}
                  />
                  {errors.workplaceAddress && (
                    <span className="text-red-500 text-sm">{errors.workplaceAddress.message}</span>
                  )}
                </div>
              </div>
            </div>
          )}


        </div>
      </ScrollArea>

      <button
        id="submit-information"
        type="submit"
        disabled={isPending}
        className="hidden"
      />
    </form>
  );
};

export default InformationForm;