import PageHeader from '@/components/add/components/PageHeader';
import StepNavigation from '@/components/add/components/StepNavigation';
import { AddDealContextProvider } from '@/components/add/contexts/addDealContext';
import React from 'react';


export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 lg:px-0">
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
