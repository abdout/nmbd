'use client';

import { UseFormSetValue } from "react-hook-form";
import { ActivitySchema } from "./validation";

interface ClubSelectorProps {
  setValue: UseFormSetValue<ActivitySchema>;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

const CLUB_TYPES = ["سياسي", "نقابي", "اجتماعي", "شبابي", "تطوعي"] as const;

export default function ClubSelector({ setValue, selectedTypes, setSelectedTypes }: ClubSelectorProps) {
  const handleSelect = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    setValue("selectedActivities", newTypes);
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-900">
           هل سبق وكنت عضو في نشاط...؟
        </label>
        <p className="text-sm text-gray-500 px-2">واحدة أو أكثر</p>
      </div>
      <div className="flex flex-wrap gap-4">
        {CLUB_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleSelect(type)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors hover:bg-opacity-80
              ${
                selectedTypes.includes(type)
                  ? "bg-neutral-600 text-background"
                  : "bg-neutral-100 text-gray-700 border border-gray-300 "
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
