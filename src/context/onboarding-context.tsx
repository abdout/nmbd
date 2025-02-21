"use client";
import React, { createContext, useState } from 'react';
import { useSession } from "next-auth/react";

interface OnboardingData {
  step: number;
  formData: Record<string, unknown>;
}

interface OnboardingContextType {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  updateUserData: (newData: Partial<OnboardingData['formData']>) => Promise<void>;
}

const defaultState: OnboardingData = {
  step: 1,
  formData: {}
};

export const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultState,
  setData: () => {},
  updateUserData: async () => {}
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [data, setData] = useState<OnboardingData>(defaultState);

  const updateUserData = async (newData: Partial<OnboardingData['formData']>) => {
    setData(prev => ({
      ...prev,
      formData: { ...prev.formData, ...newData }
    }));
    
    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ userId: session?.user?.id, ...newData }),
    });
  };

  return (
    <OnboardingContext.Provider value={{ data, setData, updateUserData }}>
      {children}
    </OnboardingContext.Provider>
  );
} 