// 'use client';
// import React, { useState } from "react";
// import { User } from "@prisma/client";
// import { useRouter } from "next/navigation";
// import { updateProfile } from "@/components/onboarding/actions";
// import UpdateButton from "@/components/onboarding/UpdateButton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import SelectPopover from "@/components/atom/popover/popover";

// interface Item {
//   label: string;
//   value: string;
// }

// type FieldPrefix = 'current' | 'original';
// type FieldName = 'Country' | 'State' | 'Locality' | 'AdminUnit' | 'Neighborhood';
// type FormDataKey = `${FieldPrefix}${FieldName}`;

// type FormDataType = {
//   [key in FormDataKey]: Item | null;
// };

// const Address = ({ user }: { user: User }) => {
//   const [formData, setFormData] = useState<FormDataType>({
//     currentCountry: user?.currentCountry
//       ? { label: user.currentCountry, value: user.currentCountry }
//       : null,
//     currentState: user?.currentState
//       ? { label: user.currentState, value: user.currentState }
//       : null,
//     currentLocality: user?.currentLocality
//       ? { label: user.currentLocality, value: user.currentLocality }
//       : null,
//     currentAdminUnit: user?.currentAdminUnit
//       ? { label: user.currentAdminUnit, value: user.currentAdminUnit }
//       : null,
//     currentNeighborhood: user?.currentNeighborhood
//       ? { label: user.currentNeighborhood, value: user.currentNeighborhood }
//       : null,
//     originalCountry: user?.originalCountry
//       ? { label: user.originalCountry, value: user.originalCountry }
//       : null,
//     originalState: user?.originalState
//       ? { label: user.originalState, value: user.originalState }
//       : null,
//     originalLocality: user?.originalLocality
//       ? { label: user.originalLocality, value: user.originalLocality }
//       : null,
//     originalAdminUnit: user?.originalAdminUnit
//       ? { label: user.originalAdminUnit, value: user.originalAdminUnit }
//       : null,
//     originalNeighborhood: user?.originalNeighborhood
//       ? { label: user.originalNeighborhood, value: user.originalNeighborhood }
//       : null,
//   });
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(false);
//   const router = useRouter();
//   const [pending, setPending] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [originalStep, setOriginalStep] = useState(1);

//   // Options data with more items
//   const countries: Item[] = [
//     { label: 'السودان', value: 'SD' },
//     { label: 'مصر', value: 'EG' },
//     { label: 'السعودية', value: 'SA' },
//     { label: 'الامارات', value: 'AE' },
//     // Add more countries as needed
//   ];

//   const states: Record<string, Item[]> = {
//     SD: [
//       { label: 'الخرطوم', value: 'KH' },
//       { label: 'الجزيرة', value: 'GZ' },
//       { label: 'نهر النيل', value: 'NR' },
//       // More states for Sudan
//     ],
//     EG: [
//       { label: 'القاهرة', value: 'CA' },
//       { label: 'الإسكندرية', value: 'AL' },
//       { label: 'أسيوط', value: 'AS' },
//       // More states for Egypt
//     ],
//     SA: [
//       { label: 'الرياض', value: 'RI' },
//       { label: 'مكة', value: 'MK' },
//       // More states for Saudi Arabia
//     ],
//     AE: [
//       { label: 'دبي', value: 'DU' },
//       { label: 'أبوظبي', value: 'AD' },
//       // More states for UAE
//     ],
//   };

//   const localities: Record<string, Item[]> = {
//     KH: [
//       { label: 'أم درمان', value: 'OMD' },
//       { label: 'بحري', value: 'BH' },
//     ],
//     CA: [
//       { label: 'مدينة نصر', value: 'NS' },
//       { label: 'الزمالك', value: 'ZM' },
//     ],
//     // Define more localities
//   };

//   const adminUnits: Record<string, Item[]> = {
//     OMD: [
//       { label: 'الخرطوم وسط', value: 'KC' },
//     ],
//     NS: [
//       { label: 'النصر', value: 'NR' },
//     ],
//     // Define more admin units
//   };

//   const neighborhoods: Record<string, Item[]> = {
//     KC: [
//       { label: 'حي القصر', value: 'GSR' },
//     ],
//     NR: [
//       { label: 'حي النصر', value: 'NSR' },
//     ],
//     // Define more neighborhoods
//   };

//   const handleSelect = (
//     fieldPrefix: FieldPrefix,
//     name: FieldName,
//     item: Item | null
//   ) => {
//     const fields: FieldName[] = ['Country', 'State', 'Locality', 'AdminUnit', 'Neighborhood'];
//     const index = fields.indexOf(name);

//     setFormData((prev) => {
//       const currentKey = `${fieldPrefix}${name}` as FormDataKey;
//       const currentValue = prev[currentKey];

//       const newFormData = {
//         ...prev,
//         [currentKey]: item,
//       };

//       // Only reset dependent fields if the selected value has changed
//       if (item?.value !== currentValue?.value) {
//         for (let i = index + 1; i < fields.length; i++) {
//           const key = `${fieldPrefix}${fields[i]}` as FormDataKey;
//           newFormData[key] = null;
//         }
//       }

//       return newFormData;
//     });

//     // Move to the next step if updating only one field
//     if (fieldPrefix === 'current') {
//       setCurrentStep((prev) => Math.max(prev, index + 2));
//     } else {
//       setOriginalStep((prev) => Math.max(prev, index + 2));
//     }
//   };

//   const resetStep = (fieldPrefix: FieldPrefix) => {
//     if (fieldPrefix === 'current') {
//       setCurrentStep(1);
//     } else {
//       setOriginalStep(1);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSuccess(false);
//     setError(false);
//     setPending(true);

//     try {
//       const submissionData = {
//         currentCountry: formData.currentCountry?.value || user.currentCountry || '',
//         currentState: formData.currentState?.value || user.currentState || '',
//         currentLocality: formData.currentLocality?.value || user.currentLocality || '',
//         currentAdminUnit: formData.currentAdminUnit?.value || user.currentAdminUnit || '',
//         currentNeighborhood: formData.currentNeighborhood?.value || user.currentNeighborhood || '',
//         originalCountry: formData.originalCountry?.value || user.originalCountry || '',
//         originalState: formData.originalState?.value || user.originalState || '',
//         originalLocality: formData.originalLocality?.value || user.originalLocality || '',
//         originalAdminUnit: formData.originalAdminUnit?.value || user.originalAdminUnit || '',
//         originalNeighborhood: formData.originalNeighborhood?.value || user.originalNeighborhood || '',
//       };

//       const response = await updateProfile(submissionData);
//       if (response.success) {
//         setSuccess(true);
//         router.refresh();
//       } else {
//         setError(true);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(true);
//     } finally {
//       setPending(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
//       <Tabs defaultValue="currentAddress" className="w-full" dir="rtl">
//         <TabsList className="flex gap-6 mb-6">
//           <TabsTrigger value="currentAddress">العنوان الحالي</TabsTrigger>
//           <TabsTrigger value="originalAddress">العنوان الأصلي</TabsTrigger>
//         </TabsList>

//         {/* Current Address Tab */}
//         <TabsContent value="currentAddress">
//           <div className="space-y-6">
//             {currentStep === 1 && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الدولة</label>
//                 <SelectPopover
//                   items={countries}
//                   selectedItem={formData.currentCountry}
//                   setSelectedItem={(item) => handleSelect('current', 'Country', item)}
//                   label={formData.currentCountry?.label || 'اختر الدولة'}
//                 />
//               </div>
//             )}
//             {currentStep === 2 && formData.currentCountry && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الولاية</label>
//                 <SelectPopover
//                   items={states[formData.currentCountry.value] || []}
//                   selectedItem={formData.currentState}
//                   setSelectedItem={(item) => handleSelect('current', 'State', item)}
//                   label={formData.currentState?.label || 'اختر الولاية'}
//                 />
//               </div>
//             )}
//             {currentStep === 3 && formData.currentState && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">المدينة</label>
//                 <SelectPopover
//                   items={localities[formData.currentState.value] || []}
//                   selectedItem={formData.currentLocality}
//                   setSelectedItem={(item) => handleSelect('current', 'Locality', item)}
//                   label={formData.currentLocality?.label || 'اختر المدينة'}
//                 />
//               </div>
//             )}
//             {currentStep === 4 && formData.currentLocality && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الوحدة</label>
//                 <SelectPopover
//                   items={adminUnits[formData.currentLocality.value] || []}
//                   selectedItem={formData.currentAdminUnit}
//                   setSelectedItem={(item) => handleSelect('current', 'AdminUnit', item)}
//                   label={formData.currentAdminUnit?.label || 'اختر الوحدة'}
//                 />
//               </div>
//             )}
//             {currentStep === 5 && formData.currentAdminUnit && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الحي</label>
//                 <SelectPopover
//                   items={neighborhoods[formData.currentAdminUnit.value] || []}
//                   selectedItem={formData.currentNeighborhood}
//                   setSelectedItem={(item) => handleSelect('current', 'Neighborhood', item)}
//                   label={formData.currentNeighborhood?.label || 'اختر الحي'}
//                 />
//               </div>
//             )}
//             {currentStep > 5 && (
//               <div>
//                 <p className="text-green-500">تم إدخال العنوان الحالي بنجاح!</p>
//                 <button
//                   type="button"
//                   onClick={() => resetStep('current')}
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//                 >
//                   تعديل
//                 </button>
//               </div>
//             )}
//           </div>
//         </TabsContent>

//         {/* Original Address Tab */}
//         <TabsContent value="originalAddress">
//           <div className="space-y-6">
//             {originalStep === 1 && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الدولة</label>
//                 <SelectPopover
//                   items={countries}
//                   selectedItem={formData.originalCountry}
//                   setSelectedItem={(item) => handleSelect('original', 'Country', item)}
//                   label={formData.originalCountry?.label || 'اختر الدولة'}
//                 />
//               </div>
//             )}
//             {originalStep === 2 && formData.originalCountry && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الولاية</label>
//                 <SelectPopover
//                   items={states[formData.originalCountry.value] || []}
//                   selectedItem={formData.originalState}
//                   setSelectedItem={(item) => handleSelect('original', 'State', item)}
//                   label={formData.originalState?.label || 'اختر الولاية'}
//                 />
//               </div>
//             )}
//             {originalStep === 3 && formData.originalState && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">المدينة</label>
//                 <SelectPopover
//                   items={localities[formData.originalState.value] || []}
//                   selectedItem={formData.originalLocality}
//                   setSelectedItem={(item) => handleSelect('original', 'Locality', item)}
//                   label={formData.originalLocality?.label || 'اختر المدينة'}
//                 />
//               </div>
//             )}
//             {originalStep === 4 && formData.originalLocality && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الوحدة</label>
//                 <SelectPopover
//                   items={adminUnits[formData.originalLocality.value] || []}
//                   selectedItem={formData.originalAdminUnit}
//                   setSelectedItem={(item) => handleSelect('original', 'AdminUnit', item)}
//                   label={formData.originalAdminUnit?.label || 'اختر الوحدة'}
//                 />
//               </div>
//             )}
//             {originalStep === 5 && formData.originalAdminUnit && (
//               <div>
//                 <label className="block text-sm font-medium mb-2">الحي</label>
//                 <SelectPopover
//                   items={neighborhoods[formData.originalAdminUnit.value] || []}
//                   selectedItem={formData.originalNeighborhood}
//                   setSelectedItem={(item) => handleSelect('original', 'Neighborhood', item)}
//                   label={formData.originalNeighborhood?.label || 'اختر الحي'}
//                 />
//               </div>
//             )}
//             {originalStep > 5 && (
//               <div>
//                 <p className="text-green-500">تم إدخال العنوان الأصلي بنجاح!</p>
//                 <button
//                   type="button"
//                   onClick={() => resetStep('original')}
//                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//                 >
//                   تعديل
//                 </button>
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>

//       <div className="mt-6">
//         <UpdateButton pending={pending} />
//         {success && (
//           <p className="text-green-500 text-sm mt-2">تم تحديث المعلومات بنجاح!</p>
//         )}
//         {error && (
//           <p className="text-red-500 text-sm mt-2">فشل في تحديث المعلومات. حاول مرة أخرى.</p>
//         )}
//       </div>
//     </form>
//   );
// };

// export default Address;

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page