'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
import UpdateButton from "@/components/onboarding/update-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectPopover from "@/components/atom/popover/popover";

interface Item {
  label: string;
  value: string;
}

type FieldName = 'Country' | 'City' | 'Year' | 'Month' | 'Day';
type FormDataKey = FieldName;

type FormDataType = {
  [key in FormDataKey]: Item | null;
};

const Birthdate = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState<FormDataType>({
    Country: null,
    City: null,
    Year: null,
    Month: null,
    Day: null
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Data options
  const countries: Item[] = [
    { label: 'السودان', value: 'SD' },
    { label: 'مصر', value: 'EG' },
    // Add more countries
  ];

  const cities: Record<string, Item[]> = {
    SD: [
      { label: 'الخرطوم', value: 'KH' },
      { label: 'أم درمان', value: 'OMD' },
      // Add more cities
    ],
    EG: [
      { label: 'القاهرة', value: 'CAI' },
      { label: 'الإسكندرية', value: 'ALX' },
    ]
  };

  // Generate years from 1950 to current year
  const years: Item[] = Array.from({ length: 74 }, (_, i) => ({
    label: `${2024 - i}`,
    value: `${2024 - i}`
  }));

  const months: Item[] = [
    { label: 'يناير', value: '1' },
    { label: 'فبراير', value: '2' },
    { label: 'مارس', value: '3' },
    { label: 'أبريل', value: '4' },
    { label: 'مايو', value: '5' },
    { label: 'يونيو', value: '6' },
    { label: 'يوليو', value: '7' },
    { label: 'أغسطس', value: '8' },
    { label: 'سبتمبر', value: '9' },
    { label: 'أكتوبر', value: '10' },
    { label: 'نوفمبر', value: '11' },
    { label: 'ديسمبر', value: '12' },
  ];

  // // Generate days 1-31
  // const days: Item[] = Array.from({ length: 31 }, (_, i) => ({
  //   label: `${i + 1}`,
  //   value: `${i + 1}`
  // }));

  const handleSelect = (name: FieldName, item: Item | null) => {
    const fields: FieldName[] = ['Country', 'City', 'Year', 'Month'];
    const index = fields.indexOf(name);

    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: item
      };

      // Reset dependent fields
      if (item?.value !== prev[name]?.value) {
        for (let i = index + 1; i < fields.length; i++) {
          newFormData[fields[i]] = null;
        }
      }

      return newFormData;
    });

    setCurrentStep(prev => Math.max(prev, index + 2));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);
    setPending(true);

    try {
      const submissionData = {
        birthCountry: formData.Country?.value || user.birthCountry || '',
        birthLocality: formData.City?.value || user.birthLocality || '',
        birthYear: formData.Year?.value || user.birthYear || '',
        birthMonth: formData.Month?.value || user.birthMonth || '',
      };

      const response = await updateProfile(submissionData);
      if (response.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" max-w-2xl mx-auto">
      <Tabs defaultValue="birthdate" className="w-full" dir="rtl">
        {/* <TabsList className="flex gap-6 mb-6">
          <TabsTrigger value="birthdate">تاريخ الميلاد</TabsTrigger>
        </TabsList> */}

        {/* Birthdate Tab */}
        <TabsContent value="birthdate">
          <div className="">
            {currentStep === 1 && (
              <SelectPopover
                items={countries}
                selectedItem={formData.Country}
                setSelectedItem={(item) => handleSelect('Country', item)}
                label="مكان الميلاد"
              />
            )}

            {currentStep === 2 && formData.Country && (
              <SelectPopover
                items={cities[formData.Country.value] || []}
                selectedItem={formData.City}
                setSelectedItem={(item) => handleSelect('City', item)}
                label="المدينة"
              />
            )}

            {currentStep === 3 && formData.City && (
              <SelectPopover
                items={years}
                selectedItem={formData.Year}
                setSelectedItem={(item) => handleSelect('Year', item)}
                label="السنة"
              />
            )}

            {currentStep === 4 && formData.Year && (
              <SelectPopover
                items={months}
                selectedItem={formData.Month}
                setSelectedItem={(item) => handleSelect('Month', item)}
                label="الشهر"
              />
            )}

            {/* {currentStep === 5 && formData.Month && (
              <SelectPopover
                items={days}
                selectedItem={formData.Day}
                setSelectedItem={(item) => handleSelect('Day', item)}
                label="اليوم"
              />
            )} */}
          </div>
        </TabsContent>
      </Tabs>

      {/* <div className="mt-6">
        <UpdateButton pending={pending} />
        {success && (
          <p className="text-green-500 text-sm mt-2">تم تحديث المعلومات بنجاح!</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">فشل في تحديث المعلومات. حاول مرة أخرى.</p>
        )}
      </div> */}
    </form>
  );
};

export default Birthdate;

