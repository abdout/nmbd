import PageHeading from '@/components/onboarding/page-heading';
import StepNavigation from '@/components/onboarding/step-nav';
import { AddDealContextProvider } from '@/components/onboarding/addDealContext';
import React from 'react';
import ButtonNavigation from '@/components/onboarding/button-nav';


export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-20 py-14">
      <PageHeading
        title="حبابك عشرة"
        description="سيكون لنا متسع من الموت للنوم"
      />

      <div className="flex flex-col gap-x-6 items-center justify-center">
        <StepNavigation />
        <AddDealContextProvider>
          <div className="w-[50%] flex flex-col items-center ">
            {children}
            <ButtonNavigation />
          </div>
        </AddDealContextProvider>
        
      </div>
      
    </div>
  );
}
