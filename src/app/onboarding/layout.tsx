'use client';
import PageHeading from '@/components/onboarding/page-heading';
import StepNavigation from '@/components/onboarding/step-nav';
import ButtonNavigation from '@/components/onboarding/button-nav';
import { useRef } from 'react';
import { Toaster } from 'sonner';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="px-20 py-10">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            maxWidth: '200px',
            minWidth: '200px'
          }
        }}
      />
      <PageHeading
        title="حبابك عشرة"
        description="سيكون لنا متسع من الموت للنوم"
      />

      <div className="flex flex-col gap-x-6 items-center justify-center">
        <div className="w-[50%] flex flex-col items-center justify-center py-14">
          <form ref={formRef}>
            {children}
          </form>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex flex-col space-y-6 items-center justify-center">
          <StepNavigation />
          <ButtonNavigation formRef={formRef} />
        </div>
      </div>
    </div>
  );
}
