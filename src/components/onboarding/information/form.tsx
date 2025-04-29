'use client';
import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { informationSchema } from "./validation";
import type { InformationSchema } from "./validation";
import { useFormContext } from '@/components/onboarding/form-context';
import Name from "./name";
import Location from "./location";
import Birthdate from "./birthdate";
import { useSubmit } from './use-submit';

// Add this at the top of the file, after the imports
declare global {
  interface Window {
    submitInformationForm?: () => boolean;
  }
}

interface FormProps {
  type: "create" | "update";
  data?: InformationSchema;
}

// Simple media query hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Default to false on server, true if window exists and we're on a device that can run JavaScript
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      
      return () => media.removeEventListener('change', listener);
    }
    return undefined;
  }, [query]);

  return matches;
};

// Simple deep equal function without external dependencies - commented out as it's currently unused
// function deepEqual<T>(a: T, b: T): boolean {
//   if (a === b) return true;
//   
//   if (a === null || b === null || 
//       typeof a !== 'object' || typeof b !== 'object') {
//     return false;
//   }
//   
//   if (Array.isArray(a) && Array.isArray(b)) {
//     if (a.length !== b.length) return false;
//     for (let i = 0; i < a.length; i++) {
//       if (!deepEqual(a[i], b[i])) return false;
//     }
//     return true;
//   }
//   
//   const keysA = Object.keys(a);
//   const keysB = Object.keys(b);
//   
//   if (keysA.length !== keysB.length) return false;
//   
//   for (const key of keysA) {
//     if (!keysB.includes(key)) return false;
//     if (!deepEqual(a[key], b[key])) return false;
//   }
//   
//   return true;
// }

const Form = ({ type, data }: FormProps) => {
  const [isPending] = useTransition();
  
  // Always use the hook unconditionally at the top level
  const formContextValue = useFormContext();
  
  // Then safely handle the potential null case
  const formRef = formContextValue?.formRef;
  const setIsSubmitting = formContextValue?.setIsSubmitting;
  const setCurrentFormId = formContextValue?.setCurrentFormId;
  
  // Set up local form ref that we'll sync with context
  const localFormRef = useRef<HTMLFormElement>(null);
  
  // Check if we're on a mobile device
  const isMobile = !useMediaQuery("(min-width: 768px)");
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset
  } = useForm<InformationSchema>({
    resolver: zodResolver(informationSchema),
    defaultValues: data,
  });

  // Initialize form with data if available
  useEffect(() => {
    if (data && type === "update") {
      reset(data);
    }
    
    // Initialize form ID for navigation
    if (setCurrentFormId) {
      setCurrentFormId("information");
    }
    
    // Make form submission available via window object for ButtonNavigation
    window.submitInformationForm = () => {
      if (localFormRef.current) {
        const submitButton = localFormRef.current.querySelector('#submit-information');
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.click();
          return true;
        }
      }
      return false;
    };
    
    return () => {
      delete window.submitInformationForm;
    };
  }, [data, reset, type, setCurrentFormId]);

  // Set form reference for ButtonNavigation if context is available
  useEffect(() => {
    if (formRef && localFormRef.current) {
      formRef.current = localFormRef.current;
    }
  }, [formRef]);

  // Use our custom submit hook
  const { onSubmit } = useSubmit({ 
    handleSubmit, 
    errors, 
    type, 
    setIsSubmitting 
  });

  return (
    <form
      ref={localFormRef}
      onSubmit={onSubmit}
      className="p-2 h-[24rem] md:h-[13rem] flex flex-col justify-center items-center mx-auto w-full max-w-screen-md"
      noValidate
    >
      <div dir="rtl" className="flex flex-col gap-6 px-6 w-full">
        <div>
          <Name register={register} errors={errors} />
        </div>
        
        <div className="flex flex-col gap-6">
          <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Location
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                defaultValues={data}
              />
            </div>
            
            <div className="relative">
              <Birthdate
                register={register}
                errors={errors}
                setValue={setValue}
                watch={watch}
                defaultValues={data}
              />
            </div>
          </div>
        </div>
      </div>

      <button 
        id="submit-information" 
        type="submit" 
        disabled={isPending}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      >
        Submit Form
      </button>
    </form>
  );
};

export default Form; 