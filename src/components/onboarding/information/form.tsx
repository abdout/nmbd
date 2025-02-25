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
  const [selectedBirthCountry, setSelectedBirthCountry] = useState<Item | null>(null);
  const [selectedBirthState, setSelectedBirthState] = useState<Item | null>(null);
  const [selectedBirthLocality, setSelectedBirthLocality] = useState<Item | null>(null);
  const [selectedYear, setSelectedYear] = useState<Item | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Item | null>(null);
  const { formRef, setIsSubmitting, setCurrentFormId } = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InformationSchema>({
    resolver: zodResolver(informationSchema),
    defaultValues: data,
  });

  useEffect(() => {
    setCurrentFormId('information');
  }, [setCurrentFormId]);

  const onSubmit = handleSubmit((formData) => {
    startTransition(async () => {
      try {
        const formPayload = {
          ...formData,
          currentCountry: selectedCountry?.value || null,
          currentState: selectedState?.value || null,
          currentLocality: selectedCity?.value || null,
          birthCountry: selectedBirthCountry?.value || null,
          birthState: selectedBirthState?.value || null,
          birthLocality: selectedBirthLocality?.value || null,
          birthYear: selectedYear?.value || null,
          birthMonth: selectedMonth?.value || null,
        };

        const action = type === "create" ? createInformation : updateInformation;
        const result = await action({ success: false, error: false }, formPayload);

        if (result.success) {
          toast.success(`Information ${type}d successfully!`);
          router.push(getNextRoute(pathname));
        } else {
          toast.error("Failed to save information");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred");
      }
    });
  });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col gap-8"
      noValidate
    >
      {INFORMATION_FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-2">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type}
            {...register(field.name as keyof InformationSchema)}
            className="border p-2 rounded"
          />
          {errors[field.name as keyof InformationSchema] && (
            <span className="text-red-500 text-sm">
              {errors[field.name as keyof InformationSchema]?.message}
            </span>
          )}
        </div>
      ))}

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