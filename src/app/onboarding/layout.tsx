'use client';
import PageHeading from '@/components/onboarding/page-heading';
import StepNavigation from '@/components/onboarding/step-nav';
import ButtonNavigation from '@/components/onboarding/button-nav';
import { FormProvider } from '@/components/onboarding/form-context';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReviewPage = pathname === '/onboarding/review';
  const [toastPosition, setToastPosition] = useState<'top-center' | 'bottom-right'>('bottom-right');

  // Update toast position based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Use 768px as the breakpoint for mobile devices
      if (window.innerWidth < 768) {
        setToastPosition('top-center');
      } else {
        setToastPosition('bottom-right');
      }
    };

    // Set initial position
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FormProvider>
      <div className={isReviewPage ? "p-6" : "px-4 sm:px-10 md:px-20 py-10"}>
        <Toaster 
          position={toastPosition}
          toastOptions={{
            style: {
              maxWidth: '300px',
              minWidth: '200px',
              padding: '16px',
              fontSize: '14px'
            },
            duration: 3000
          }}
        />
        {!isReviewPage && (
          <PageHeading
            title="حبابك عشرة"
            description="سيكون لنا متسع من الموت للنوم"
          />
        )}

        <div className="flex flex-col gap-x-6 items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center py-14">
            {children}
          </div>
          {!isReviewPage && (
            <div className="absolute bottom-10 left-0 right-0 flex flex-col space-y-6 items-center justify-center">
              <StepNavigation />
              <ButtonNavigation />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
