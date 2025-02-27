'use client';
import PageHeading from '@/components/onboarding/page-heading';
import StepNavigation from '@/components/onboarding/step-nav';
import ButtonNavigation from '@/components/onboarding/button-nav';
import { FormProvider } from '@/components/onboarding/form-context';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReviewPage = pathname === '/onboarding/review';

  return (
    <FormProvider>
      <div className={isReviewPage ? "p-6" : "px-20 py-10"}>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              maxWidth: '400px',
              minWidth: '300px',
              padding: '16px',
              fontSize: '16px'
            },
            duration: 5000
          }}
          closeButton
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
