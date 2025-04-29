// 'use client';
// import { useState, useTransition, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { informationSchema } from "./validation";
// import type { InformationSchema } from "./validation";
// import { useFormContext } from '@/components/onboarding/form-context';
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { FocusContainer } from "@/components/onboarding/focus-container";
// import { AnimatedHierarchicalSelect, SelectionStep } from "../../atom/hierarchical-select";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useSubmit } from './use-submit';
// import { useFormInit } from '../education/use-init';
// import { 
//   Carousel, 
//   CarouselContent, 
//   CarouselItem, 
//   CarouselNext, 
//   CarouselPrevious 
// } from "@/components/ui/carousel";

// // Import constants from the constant.ts file
// import { 
//   COUNTRIES, 
//   STATES, 
//   LOCALITIES, 
//   ADMIN_UNITS, 
//   NEIGHBORHOODS,
//   BIRTH_MONTHS,
//   generateBirthYears
// } from './constant';

// // Add this at the top of the file, after the imports
// declare global {
//   interface Window {
//     submitInformationForm?: () => boolean;
//   }
// }

// interface FormTryProps {
//   type: "create" | "update";
//   data?: InformationSchema;
// }

// // Simple media query hook
// const useMediaQuery = (query: string): boolean => {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     // Default to false on server, true if window exists and we're on a device that can run JavaScript
//     if (typeof window !== 'undefined') {
//       const media = window.matchMedia(query);
//       setMatches(media.matches);
      
//       const listener = () => setMatches(media.matches);
//       media.addEventListener('change', listener);
      
//       return () => media.removeEventListener('change', listener);
//     }
//     return undefined;
//   }, [query]);

//   return matches;
// };

// // Custom hook for form validation
// const useFormValidation = <T extends Record<string, any>>({
//   errors,
//   errorFields,
//   errorMessage,
//   defaultValues,
//   currentValues,
//   toastStyle
// }: {
//   errors: Record<string, any>;
//   errorFields: string[];
//   errorMessage: string;
//   defaultValues?: Partial<T>;
//   currentValues?: Partial<T>;
//   toastStyle?: React.CSSProperties;
// }) => {
//   const sectionRef = useRef<HTMLDivElement>(null);
  
//   useEffect(() => {
//     // Check if any error field has an error
//     const hasError = errorFields.some(field => errors[field]);
    
//     if (hasError) {
//       // Show error in toast
//       toast.error(errorMessage, {
//         style: {
//           background: 'rgb(239 68 68)',
//           color: 'white',
//           border: 'none',
//           textAlign: 'right',
//           direction: 'rtl',
//           ...toastStyle
//         }
//       });
//     }
//   }, [errors, errorFields, errorMessage, toastStyle]);
  
//   return { sectionRef };
// };

// // Custom hook for selection handling
// const useSelect = <T extends Record<string, any>>({
//   setValue,
//   fieldMappings
// }: {
//   setValue: (name: any, value: any) => void;
//   fieldMappings: Record<string, string>;
// }) => {
//   // Handle selection completion
//   const handleComplete = (selections: Record<string, any>) => {
//     // Map selected values to form fields
//     Object.entries(selections).forEach(([stepId, selection]) => {
//       const formField = fieldMappings[stepId];
//       if (formField && selection) {
//         setValue(formField as keyof T, selection.value);
//       }
//     });
//   };
  
//   return { handleComplete };
// };

// const FormTry = ({ type, data }: FormTryProps) => {
//   const [isPending] = useTransition();
  
//   // Always use the hook unconditionally at the top level
//   const formContextValue = useFormContext();
  
//   // Then safely handle the potential null case
//   const formRef = formContextValue?.formRef;
//   const setIsSubmitting = formContextValue?.setIsSubmitting;
//   const setCurrentFormId = formContextValue?.setCurrentFormId;
  
//   // Set up local form ref that we'll sync with context
//   const localFormRef = useRef<HTMLFormElement>(null);
  
//   // Education level state
//   const [educationLevel, setEducationLevel] = useState<string>('student');
  
//   // Check if we're on a mobile device
//   const isMobile = !useMediaQuery("(min-width: 768px)");
  
//   // Add isInitialRender ref at the top level of the component
//   const isInitialRender = useRef(true);
  
//   // Step progress tracking
//   const [currentStep, setCurrentStep] = useState(0);
//   const [stepsCompleted, setStepsCompleted] = useState<Record<number, boolean>>({});
  
//   // Update isInitialRender after the first render
//   useEffect(() => {
//     // Set isInitialRender to false after the first render
//     if (isInitialRender.current) {
//       isInitialRender.current = false;
//     }
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     watch,
//     reset,
//     trigger
//   } = useForm<InformationSchema>({
//     resolver: zodResolver(informationSchema),
//     defaultValues: data,
//   });

//   // Use our form initialization hook
//   const { } = useFormInit({
//     data,
//     reset,
//     setEducationLevel,
//     setCurrentFormId,
//     setValue
//   });

//   // Set form reference for ButtonNavigation if context is available
//   if (formRef && localFormRef.current) {
//     formRef.current = localFormRef.current;
//   }

//   // Use our custom submit hook
//   const { onSubmit } = useSubmit({ 
//     handleSubmit, 
//     errors, 
//     type, 
//     setIsSubmitting 
//   });
  
//   // Handle validation and navigation between steps
//   const handleNextStep = async () => {
//     let fieldsToValidate: (keyof InformationSchema)[] = [];
    
//     // Determine which fields to validate based on current step
//     if (currentStep === 0) {
//       fieldsToValidate = ['fullname', 'name'];
//     } else if (currentStep === 1) {
//       fieldsToValidate = ['currentCountry', 'currentState', 'currentLocality', 'currentAdminUnit', 'currentNeighborhood'];
//     } else if (currentStep === 2) {
//       fieldsToValidate = ['birthCountry', 'birthState', 'birthLocality', 'birthYear', 'birthMonth'];
//     }
    
//     // Validate the fields
//     const isValid = await trigger(fieldsToValidate);
    
//     if (isValid) {
//       // Mark current step as completed
//       setStepsCompleted(prev => ({ ...prev, [currentStep]: true }));
      
//       // Move to the next step
//       setCurrentStep(prev => prev + 1);
//     } else {
//       // Show general validation error
//       toast.error("يرجى إكمال جميع الحقول المطلوبة", {
//         style: {
//           background: 'rgb(239 68 68)',
//           color: 'white',
//           border: 'none',
//           textAlign: 'right',
//           direction: 'rtl'
//         }
//       });
//     }
//   };
  
//   const handlePreviousStep = () => {
//     setCurrentStep(prev => Math.max(0, prev - 1));
//   };
  
//   // Check if it's the final step
//   const isFinalStep = currentStep === 3;

//   return (
//     <form
//       ref={localFormRef}
//       onSubmit={onSubmit}
//       className="p-2 h-[30rem] md:h-[21rem] flex flex-col mx-0 md:mx-auto"
//       noValidate
//     >
//       <div className="relative h-full">
//         <Carousel 
//           className="h-full w-full" 
//           opts={{ 
//             loop: false,
//             startIndex: currentStep,
//           }}
//           dir="ltr"
//         >
//           <CarouselContent className="h-full">
//             {/* Step 1: Personal Info, Location and Birthdate */}
//             <CarouselItem className="h-full pt-0">
//               <div dir="rtl" className="w-full h-full flex flex-col justify-center">
//                 <div className="p-6">
//                   {/* Name Fields */}
//                   <div className="mb-10">
//                     <FocusContainer
//                       shrunkWidth="55%" 
//                       expandedWidth="45%"
//                     >
//                       {({ getClassName, handleFocus, handleBlur }) => (
//                         <>
//                           <div 
//                             className={getClassName('fullname', 'mb-6 md:mb-0')} 
//                             data-name-field="true"
//                           >
//                             <label htmlFor="fullname" className="block mb-2 text-sm font-medium">
//                               الاسم الكامل
//                             </label>
//                             <Input
//                               id="fullname"
//                               placeholder="الاسم الكامل"
//                               dir="rtl"
//                               className="text-right"
//                               {...register('fullname', {
//                                 required: "اكتب الاسم الكامل"
//                               })}
//                               onFocus={handleFocus('fullname')}
//                               onBlur={handleBlur}
//                               data-name-field="true"
//                             />
//                             {errors.fullname && (
//                               <span className="text-red-500 text-sm">{errors.fullname.message}</span>
//                             )}
//                           </div>
//                           <div 
//                             className={getClassName('name')}
//                             data-name-field="true"
//                           >
//                             <label htmlFor="name" className="block mb-2 text-sm font-medium">
//                               اسم المستخدم
//                             </label>
//                             <Input
//                               id="name"
//                               placeholder="اسم المستخدم"
//                               dir="rtl"
//                               className="text-right"
//                               {...register('name')}
//                               onFocus={handleFocus('name')}
//                               onBlur={handleBlur}
//                               data-name-field="true"
//                             />
//                             {errors.name && (
//                               <span className="text-red-500 text-sm">{errors.name.message}</span>
//                             )}
//                           </div>
//                         </>
//                       )}
//                     </FocusContainer>
//                   </div>
                  
//                   {/* Location and Birthdate in a grid on medium screens and up */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Location Component */}
//                     <div className="w-full" data-location-field="true">
//                       <div className="relative" style={{ 
//                         zIndex: 50,
//                         position: "relative",
//                         isolation: "isolate" 
//                       }} data-location-field="true">
//                         <AnimatedHierarchicalSelect 
//                           steps={[
//                             {
//                               id: "country",
//                               title: "العنوان",
//                               placeholder: "اختر الدولة",
//                               emptyMessage: "لا توجد دول متاحة",
//                               getOptions: () => COUNTRIES
//                             },
//                             {
//                               id: "state",
//                               title: "الولاية",
//                               placeholder: "اختر الولاية",
//                               emptyMessage: "لا توجد محافظات متاحة",
//                               getOptions: (prev) => {
//                                 const countryId = prev.country?.value;
//                                 return countryId ? (STATES[countryId] || []) : [];
//                               }
//                             },
//                             {
//                               id: "locality",
//                               title: "المنطقة",
//                               placeholder: "اختر المنطقة",
//                               emptyMessage: "لا توجد مناطق متاحة",
//                               getOptions: (prev) => {
//                                 const stateId = prev.state?.value;
//                                 return stateId ? (LOCALITIES[stateId] || []) : [];
//                               }
//                             },
//                             {
//                               id: "admin_unit",
//                               title: "الوحدة",
//                               placeholder: "اختر الوحدة",
//                               emptyMessage: "لا توجد وحدات متاحة",
//                               getOptions: (prev) => {
//                                 const localityId = prev.locality?.value;
//                                 return localityId ? (ADMIN_UNITS[localityId] || []) : [];
//                               }
//                             },
//                             {
//                               id: "neighborhood",
//                               title: "الحي",
//                               placeholder: "اختر الحي",
//                               emptyMessage: "لا توجد أحياء متاحة",
//                               getOptions: (prev) => {
//                                 const adminUnitId = prev.admin_unit?.value;
//                                 return adminUnitId ? (NEIGHBORHOODS[adminUnitId] || []) : [];
//                               }
//                             }
//                           ]} 
//                           onComplete={(selections) => {
//                             Object.entries(selections).forEach(([stepId, selection]) => {
//                               const mappings: Record<string, string> = {
//                                 country: 'currentCountry',
//                                 state: 'currentState',
//                                 locality: 'currentLocality',
//                                 admin_unit: 'currentAdminUnit',
//                                 neighborhood: 'currentNeighborhood'
//                               };
                              
//                               const formField = mappings[stepId];
//                               if (formField && selection) {
//                                 setValue(formField as keyof InformationSchema, selection.value);
//                               }
//                             });
//                           }}
//                           timing={{
//                             transitionDelay: 250,
//                             dropdownDelay: 600
//                           }}
//                           className="w-full"
//                           isLastStep={true}
//                           data-location-field="true"
//                         />
//                       </div>
//                     </div>
                    
//                     {/* Birthdate Component */}
//                     <div className="w-full" data-birthdate-field="true">
//                       <div className="relative" style={{ 
//                         zIndex: 40,
//                         position: "relative"
//                       }} data-birthdate-field="true">
//                         <AnimatedHierarchicalSelect 
//                           steps={[
//                             {
//                               id: "country",
//                               title: "الميلاد",
//                               placeholder: "اختر دولة الميلاد",
//                               emptyMessage: "لا توجد دول متاحة",
//                               getOptions: () => COUNTRIES
//                             },
//                             {
//                               id: "state",
//                               title: "ولاية الميلاد",
//                               placeholder: "اختر ولاية الميلاد",
//                               emptyMessage: "لا توجد ولايات متاحة",
//                               getOptions: (prev) => {
//                                 const countryId = prev.country?.value;
//                                 return countryId ? (STATES[countryId] || []) : [];
//                               }
//                             },
//                             {
//                               id: "locality",
//                               title: "محلية الميلاد",
//                               placeholder: "اختر محلية الميلاد",
//                               emptyMessage: "لا توجد محليات متاحة",
//                               getOptions: (prev) => {
//                                 const stateId = prev.state?.value;
//                                 return stateId ? (LOCALITIES[stateId] || []) : [];
//                               }
//                             },
//                             {
//                               id: "year",
//                               title: "سنة الميلاد",
//                               placeholder: "اختر سنة الميلاد",
//                               emptyMessage: "لا توجد سنوات متاحة",
//                               getOptions: () => generateBirthYears()
//                             },
//                             {
//                               id: "month",
//                               title: "شهر الميلاد",
//                               placeholder: "اختر شهر الميلاد",
//                               emptyMessage: "لا توجد شهور متاحة",
//                               getOptions: () => BIRTH_MONTHS
//                             }
//                           ]}
//                           onComplete={(selections) => {
//                             Object.entries(selections).forEach(([stepId, selection]) => {
//                               const mappings: Record<string, string> = {
//                                 country: 'birthCountry',
//                                 state: 'birthState',
//                                 locality: 'birthLocality',
//                                 year: 'birthYear',
//                                 month: 'birthMonth'
//                               };
                              
//                               const formField = mappings[stepId];
//                               if (formField && selection) {
//                                 setValue(formField as keyof InformationSchema, selection.value);
//                               }
//                             });
//                           }}
//                           timing={{
//                             transitionDelay: 250,
//                             dropdownDelay: 600
//                           }}
//                           className="w-full"
//                           data-birthdate-field="true"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CarouselItem>
            
//             {/* Step 2: Education (was Step 4) */}
//             <CarouselItem className="h-full pt-0">
//               <div dir="rtl" className="w-full h-full flex flex-col justify-center">
//                 <div className="p-6">
//                   <div dir="rtl" className="flex flex-col" data-section="degreeSelector">
//                     <p className="text-sm font-semibold mb-2">
//                       الدرجة العلمية<span className="hidden md:inline">:</span>
//                     </p>
                    
//                     {/* Desktop UI (md screens and above) */}
//                     <div className="hidden md:block">
//                       <hr className="w-20 h-[1px] bg-black -mt-1 mb-3" />
//                       <div className="flex justify-between pl-10">
//                         {[
//                           { id: 'student', label: 'طالب' },
//                           { id: 'diploma', label: 'دبلوم' },
//                           { id: 'bachelor', label: 'بكالوريوس' },
//                           { id: 'master', label: 'ماجستير' },
//                           { id: 'phd', label: 'دكتوراه' },
//                           { id: 'professor', label: 'أستاذية' }
//                         ].map((level) => (
//                           <Button
//                             key={level.id}
//                             size='sm'
//                             type="button"
//                             onClick={() => {
//                               setValue('educationLevel', level.id);
//                               setEducationLevel(level.id);
//                             }}
//                             className={`h-7 text-[13px] pb-1 shadow-none rounded-full ${educationLevel === level.id ? 'bg-neutral-200' : 'bg-background'} text-black hover:bg-neutral-100 focus:bg-neutral-200`}
//                           >
//                             {level.label}
//                           </Button>
//                         ))}
//                       </div>
//                     </div>
                    
//                     {/* Mobile UI (smaller than md screens) */}
//                     <div className="md:hidden w-full">
//                       <Select
//                         onValueChange={(value) => {
//                           setValue('educationLevel', value);
//                           setEducationLevel(value);
//                         }}
//                         value={educationLevel || "student"}
//                         dir="rtl"
//                       >
//                         <SelectTrigger className="h-9 text-right" aria-label="الدرجة العلمية">
//                           <SelectValue placeholder="اختر الدرجة العلمية" />
//                         </SelectTrigger>
//                         <SelectContent className="text-right" position="popper" dir="rtl" side="bottom" align="start">
//                           {[
//                             { id: 'student', label: 'طالب' },
//                             { id: 'diploma', label: 'دبلوم' },
//                             { id: 'bachelor', label: 'بكالوريوس' },
//                             { id: 'master', label: 'ماجستير' },
//                             { id: 'phd', label: 'دكتوراه' },
//                             { id: 'professor', label: 'أستاذية' }
//                           ].map((level) => (
//                             <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
                  
//                   {educationLevel && (
//                     <div className="mt-4">
//                       {/* Show degree-specific fields */}
//                       {educationLevel === 'student' && (
//                         <div>
//                           {/* Student fields */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                               <Input
//                                 placeholder="اسم المؤسسة التعليمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('studentInstitution')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">الكلية</label>
//                               <Input
//                                 placeholder="الكلية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('studentFaculty')}
//                               />
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">البرنامج</label>
//                               <Input
//                                 placeholder="البرنامج"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('studentProgram')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">السنة الدراسية</label>
//                               <Input
//                                 placeholder="السنة الدراسية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('studentYear')}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Diploma fields */}
//                       {educationLevel === 'diploma' && (
//                         <div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                               <Input
//                                 placeholder="اسم المؤسسة التعليمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('diplomaInstitution')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">التخصص</label>
//                               <Input
//                                 placeholder="التخصص"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('diplomaMajor')}
//                               />
//                             </div>
//                           </div>
//                           <div className="mt-4">
//                             <label className="block mb-2 text-sm font-medium">سنة الإكمال</label>
//                             <Input
//                               placeholder="سنة الإكمال"
//                               dir="rtl"
//                               className="text-right w-full md:w-1/2"
//                               {...register('diplomaCompletionYear')}
//                             />
//                           </div>
                          
//                           {/* Occupation fields */}
//                           <div className="mt-6 pt-4 border-t">
//                             <h3 className="text-sm font-medium mb-3">معلومات الوظيفة</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">قطاع العمل</label>
//                                 <Input
//                                   placeholder="قطاع العمل"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('employmentSector')}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">اسم الشركة</label>
//                                 <Input
//                                   placeholder="اسم الشركة أو المؤسسة"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('companyName')}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Bachelor fields */}
//                       {educationLevel === 'bachelor' && (
//                         <div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                               <Input
//                                 placeholder="اسم المؤسسة التعليمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('bachelorInstitution')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">التخصص</label>
//                               <Input
//                                 placeholder="التخصص"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('bachelorMajor')}
//                               />
//                             </div>
//                           </div>
//                           <div className="mt-4">
//                             <label className="block mb-2 text-sm font-medium">سنة الإكمال</label>
//                             <Input
//                               placeholder="سنة الإكمال"
//                               dir="rtl"
//                               className="text-right w-full md:w-1/2"
//                               {...register('bachelorCompletionYear')}
//                             />
//                           </div>
                          
//                           {/* Occupation fields */}
//                           <div className="mt-6 pt-4 border-t">
//                             <h3 className="text-sm font-medium mb-3">معلومات الوظيفة</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">قطاع العمل</label>
//                                 <Input
//                                   placeholder="قطاع العمل"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('employmentSector')}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">اسم الشركة</label>
//                                 <Input
//                                   placeholder="اسم الشركة أو المؤسسة"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('companyName')}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Master fields */}
//                       {educationLevel === 'master' && (
//                         <div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                               <Input
//                                 placeholder="اسم المؤسسة التعليمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('masterInstitution')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">التخصص</label>
//                               <Input
//                                 placeholder="التخصص"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('masterMajor')}
//                               />
//                             </div>
//                           </div>
//                           <div className="mt-4">
//                             <label className="block mb-2 text-sm font-medium">سنة الإكمال</label>
//                             <Input
//                               placeholder="سنة الإكمال"
//                               dir="rtl"
//                               className="text-right w-full md:w-1/2"
//                               {...register('masterCompletionYear')}
//                             />
//                           </div>
                          
//                           {/* Bachelor information */}
//                           <div className="mt-6 pt-4 border-t">
//                             <h3 className="text-sm font-medium mb-3">معلومات البكالوريوس</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                                 <Input
//                                   placeholder="اسم المؤسسة التعليمية"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('bachelorInstitution')}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">التخصص</label>
//                                 <Input
//                                   placeholder="التخصص"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('bachelorMajor')}
//                                 />
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Occupation fields */}
//                           <div className="mt-6 pt-4 border-t">
//                             <h3 className="text-sm font-medium mb-3">معلومات الوظيفة</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">قطاع العمل</label>
//                                 <Input
//                                   placeholder="قطاع العمل"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('employmentSector')}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">اسم الشركة</label>
//                                 <Input
//                                   placeholder="اسم الشركة أو المؤسسة"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('companyName')}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* PhD fields */}
//                       {educationLevel === 'phd' && (
//                         <div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                               <Input
//                                 placeholder="اسم المؤسسة التعليمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('phdInstitution')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">التخصص</label>
//                               <Input
//                                 placeholder="التخصص"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('phdMajor')}
//                               />
//                             </div>
//                           </div>
//                           <div className="mt-4">
//                             <label className="block mb-2 text-sm font-medium">سنة الإكمال</label>
//                             <Input
//                               placeholder="سنة الإكمال"
//                               dir="rtl"
//                               className="text-right w-full md:w-1/2"
//                               {...register('phdCompletionYear')}
//                             />
//                           </div>
                          
//                           {/* Occupation fields */}
//                           <div className="mt-6 pt-4 border-t">
//                             <h3 className="text-sm font-medium mb-3">معلومات الوظيفة</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">قطاع العمل</label>
//                                 <Input
//                                   placeholder="قطاع العمل"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('employmentSector')}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">اسم الشركة</label>
//                                 <Input
//                                   placeholder="اسم الشركة أو المؤسسة"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('companyName')}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Professor fields */}
//                       {educationLevel === 'professor' && (
//                         <div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">المؤسسة التعليمية</label>
//                               <Input
//                                 placeholder="اسم المؤسسة التعليمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('professorInstitution')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">التخصص</label>
//                               <Input
//                                 placeholder="التخصص"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('professorMajor')}
//                               />
//                             </div>
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">الرتبة الأكاديمية</label>
//                               <Input
//                                 placeholder="الرتبة الأكاديمية"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('academicRank')}
//                               />
//                             </div>
//                             <div>
//                               <label className="block mb-2 text-sm font-medium">سنة الحصول على الدكتوراه</label>
//                               <Input
//                                 placeholder="سنة الحصول على الدكتوراه"
//                                 dir="rtl"
//                                 className="text-right"
//                                 {...register('professorCompletionYear')}
//                               />
//                             </div>
//                           </div>
                          
//                           {/* Occupation fields */}
//                           <div className="mt-6 pt-4 border-t">
//                             <h3 className="text-sm font-medium mb-3">معلومات الوظيفة</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">قطاع العمل</label>
//                                 <Input
//                                   placeholder="قطاع العمل"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('employmentSector')}
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block mb-2 text-sm font-medium">اسم الشركة/الجامعة</label>
//                                 <Input
//                                   placeholder="اسم الشركة أو المؤسسة"
//                                   dir="rtl"
//                                   className="text-right"
//                                   {...register('companyName')}
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="mt-8 flex justify-center">
//                   <Button 
//                     type="submit" 
//                     className="w-32 bg-green-600 hover:bg-green-700"
//                     disabled={isPending}
//                   >
//                     إرسال
//                   </Button>
//                 </div>
//               </div>
//             </CarouselItem>
//           </CarouselContent>
          
//           {/* Update validation logic for the next button */}
//           {/* Navigation arrows */}
//           <div className="hidden sm:block">
//             <CarouselPrevious 
//               className="-left-20 hover:muted" 
//               onClick={(e) => {
//                 e.preventDefault();
//                 handlePreviousStep();
//               }}
//             />
//             <CarouselNext 
//               className="-right-20 hover:muted"
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (currentStep < 1) {
//                   handleNextStep();
//                 } else {
//                   // Submit the form if on the last step
//                   localFormRef.current?.requestSubmit();
//                 }
//               }}
//             />
//           </div>
//         </Carousel>
//       </div>

//       <button 
//         id="submit-information" 
//         type="submit" 
//         disabled={isPending}
//         style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
//       >
//         Submit Form
//       </button>
//     </form>
//   );
// };

// export default FormTry;
