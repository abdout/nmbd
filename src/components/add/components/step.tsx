'use client';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
import { editRoutes } from '@/components/add/types';

const steps = [
  { title: 'الاحكام', route: 'terms', link: editRoutes.TERMS },
  { title: 'المرفقات', route: 'attachment', link: editRoutes.ATTACHMENT },
  { title: 'الاتصال', route: 'contact', link: editRoutes.CONTACT },
  { title: 'المعلومات', route: 'basic-info', link: editRoutes.BASIC_INFO },
  { title: 'العنوان', route: 'address', link: editRoutes.LOCATION },
  { title: 'Review', route: 'review', link: editRoutes.REVIEW },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);

  // States to track the current step, visited steps, and steps with errors
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<{ [key: string]: boolean }>({});
  const [errorSteps, setErrorSteps] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Set current step based on the path
    const stepIndex = steps.findIndex((step) => step.route === currentPath);
    setCurrentStep(stepIndex);

    // Mark the current step as visited
    setVisitedSteps((prev) => ({
      ...prev,
      [currentPath]: true,
    }));

    // Simulate an error for the "contact" step as an example
    if (currentPath === 'contact') {
      setErrorSteps((prev) => ({ ...prev, contact: true }));
    }
  }, [currentPath]);

  return (
    <div className="mb-4 mt-4 lg:mb-0 min-w-60">
      {/* Back Button */}
      <Link
        href={steps[currentStep - 1]?.link || steps[0].link}
        className="mb-2 flex items-center gap-2 text-sm disabled:text-white/50 lg:mb-4 lg:gap-3"
      >
        السابق
      </Link>

      {/* Step Navigation */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:justify-start lg:gap-4">
        {steps.map((step, i) => {
          const isActive = currentPath === step.route;
          const isVisited = visitedSteps[step.route];
          const hasError = errorSteps[step.route];

          return (
            <Link
              href={step.link}
              key={step.link}
              className="group z-20 flex items-center gap-2 text-[16px]"
              prefetch={true}
            >
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full border text-sm transition-colors duration-200 lg:h-7 lg:w-7',
                  {
                    'bg-yellow-400 text-black border-none': isActive, // current in progress step
                    'bg-green-500 text-white border-none': isVisited && !hasError && !isActive, // completed with valid data
                    'bg-red-500 text-white border-none': isVisited && hasError, // visited with errors
                    'border-black text-black': !isVisited, // not yet visited step
                  }
                )}
              >
                {i + 1}
              </span>
              <span
                className={clsx(
                  'hidden transition-colors duration-200 reveal lg:block',
                  {
                    'font-light': !isActive,
                    'font-medium ': isActive,
                  }
                )}
              >
                {step.title}
              </span>
            </Link>
          );
        })}
        {/* Mobile Background Dashes */}
        <div className="absolute top-4 flex h-1 w-full border-b border-dashed lg:hidden" />
      </div>
    </div>
  );
}
