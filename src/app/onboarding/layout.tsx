import PageHeader from '@/components/onboarding/page-header';
import StepNavigation from '@/components/onboarding/step-navigation';
import { AddDealContextProvider } from '@/components/onboarding/addDealContext';
import React from 'react';


export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-20 py-10">
      <PageHeader
        title="حبابك عشرة"
        subtitle="سيكون لنا متسع من الموت للنوم"
      />

      <div className="mt-10 mb-14 flex flex-col gap-x-10  lg:flex-row">
        <StepNavigation />
        <AddDealContextProvider>
          <div className="w-full">{children}</div>
        </AddDealContextProvider>
      </div>
    </div>
  );
}
