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
    <div className=" px-20 py-10">
      <PageHeading
        title="حبابك عشرة"
        description="سيكون لنا متسع من الموت للنوم"
      />

      <div className="flex flex-col gap-x-6 items-center justify-center">
        
        <AddDealContextProvider>
          <div className="w-[50%] flex flex-col items-center justify-center py-14">
            {children}
            
          </div>
        </AddDealContextProvider>
        <div className="absolute bottom-10 left-0 right-0 flex flex-col space-y-6 items-center justify-center">
        <StepNavigation />
        <ButtonNavigation />
        </div>
      </div>
      
    </div>
  );
}
