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
}

const defaultState: OnboardingData = {
  step: 1,
  formData: {}
};

export const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultState,
  setData: () => {}
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [data, setData] = useState<OnboardingData>(defaultState);

  const updateUserData = async (data: any) => {
    setData(prev => ({ ...prev, ...data }));
    
    // Update user data in database
    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ userId: session?.user?.id, ...data }),
    });
  };

  return (
    <OnboardingContext.Provider value={{ data, setData }}>
      {children}
    </OnboardingContext.Provider>
  );
} 