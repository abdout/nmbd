"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { informationSchema } from "./validation";
import { createInformation, updateInformation } from "./action";
import { INFORMATION_FIELDS } from "./constants";
import type { InformationSchema } from "./validation";

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
  const [selectedCountry, setSelectedCountry] = useState<Item | null>(null);
  const [selectedState, setSelectedState] = useState<Item | null>(null);
  const [selectedCity, setSelectedCity] = useState<Item | null>(null);
  const [selectedBirthCountry, setSelectedBirthCountry] = useState<Item | null>(null);
  const [selectedBirthState, setSelectedBirthState] = useState<Item | null>(null);
  const [selectedBirthLocality, setSelectedBirthLocality] = useState<Item | null>(null);
  const [selectedYear, setSelectedYear] = useState<Item | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Item | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InformationSchema>({
    resolver: zodResolver(informationSchema),
    defaultValues: data,
  });

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
          router.refresh();
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
    <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
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
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white p-3 rounded disabled:opacity-50"
      >
        {isPending ? "Saving..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default InformationForm;