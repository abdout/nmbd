'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
// import BackButton from './back-button';  // Import the BackButton component

const steps = [
  // { title: 'الاحكام', route: 'terms', link: '/onboarding/terms' },
  { title: 'المرفقات', route: 'attachment', link: '/onboarding/attachment' },
  { title: 'الاتصال', route: 'contact', link: '/onboarding/contact' },
  { title: 'المعلومات', route: 'basic-info', link: '/onboarding/basic-info' },
  { title: 'العنوان', route: 'address', link: '/onboarding/address' },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);

  // const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<{ [key: string]: boolean }>({});
  const [errorSteps, setErrorSteps] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // const stepIndex = steps.findIndex((step) => step.route === currentPath);
    // setCurrentStep(stepIndex);

    setVisitedSteps((prev) => ({
      ...prev,
      [currentPath]: true,
    }));

    if (currentPath === 'contact') {
      setErrorSteps((prev) => ({ ...prev, contact: true }));
    }
  }, [currentPath]);

  return (
    <div className='flex flex-col'>
      {/* <BackButton currentStep={currentStep} /> */}
      <div className=" ">
        <div className="relative flex flex-row justify-between  gap-2 lg:gap-4">
          {steps.map((step) => {
            const isActive = currentPath === step.route;
            const isVisited = visitedSteps[step.route];
            const hasError = errorSteps[step.route];

            return (
              <Link
                href={step.link}
                key={step.link}
                className="group z-20 flex items-center gap-2"
                prefetch={true}
              >
                <span
                  className={clsx(
                    'flex h-3 w-3 items-center justify-center rounded-full bg-neutral-200 text-sm transition-colors duration-200 lg:h-4 lg:w-4',
                    {
                      'bg-yellow-400 text-black border ': isActive,
                      'bg-green-500 text-white border-none': isVisited && !hasError && !isActive,
                      'bg-red-500 text-white border-none': isVisited && hasError,
                      'border-black text-black': !isVisited,
                    }
                  )}
                >
                  {/* {i + 1} */}
                </span>
                {/* <span
                  className={clsx(
                    'hidden transition-colors duration-200 reveal lg:block',
                    {
                      'font-light': !isActive,
                      'font-medium': isActive,
                    }
                  )}
                >
                  {step.title}
                </span> */}
              </Link>
            );
          })}
          {/* <div className="absolute top-3 flex h-1 w-full border-b border-dashed " /> */}
        </div>
      </div>
    </div>
  );
}