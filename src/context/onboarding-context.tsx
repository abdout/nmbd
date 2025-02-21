"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";

const OnboardingContext = createContext<{
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userData: any;
  updateUserData: (data: any) => void;
}>({
  currentStep: 1,
  setCurrentStep: () => {},
  userData: {},
  updateUserData: () => {},
});

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});

  const updateUserData = async (data: any) => {
    setUserData(prev => ({ ...prev, ...data }));
    
    // Update user data in database
    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ userId: session?.user?.id, ...data }),
    });
  };

  return (
    <OnboardingContext.Provider value={{ currentStep, setCurrentStep, userData, updateUserData }}>
      {children}
    </OnboardingContext.Provider>
  );
}; 