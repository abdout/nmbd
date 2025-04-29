'use client';
import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "./validation";
import type { EducationSchema } from "./validation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormContext } from '@/components/onboarding/form-context';
import DegreeSelector from "@/components/onboarding/education/degree-selector";
import Degree from "@/components/onboarding/education/degree";
import { submitEducation } from "./action";
import { useRouter } from "next/navigation";
import { onboardingRoutes } from "@/components/onboarding/type";
import { ErrorToast, SuccessToast } from "@/components/atom/toast";

// Add this at the top of the file, after the imports
declare global {
  interface Window {
    submitEducationForm?: () => boolean;
    educationFormSubmitted?: boolean;
  }
}

interface FormProps {
  type: "create" | "update";
  data?: any;
}

// Simple media query hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
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

const Form = ({ type, data }: FormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const formContextValue = useFormContext();
  const formRef = formContextValue?.formRef;
  const setIsSubmitting = formContextValue?.setIsSubmitting;
  const setCurrentFormId = formContextValue?.setCurrentFormId;
  
  const localFormRef = useRef<HTMLFormElement>(null);
  
  // Initialize with student as default
  const [educationLevel, setEducationLevel] = useState<string>('student');
  
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset
  } = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      ...data,
      educationLevel: 'student', // Set default education level
    },
  });

  // Initialize form with default values
  useEffect(() => {
    if (type === "create") {
      // Set default values for student
      setValue('educationLevel', 'student');
      setValue('studentInstitution', '');
      setValue('studentFaculty', '');
      setValue('studentProgram', '');
    } else if (data) {
      reset(data);
      setEducationLevel(data.educationLevel || 'student');
    }
  }, [type, data, setValue, reset]);

  useEffect(() => {
    if (formRef && localFormRef.current) {
      formRef.current = localFormRef.current;
    }
    
    if (setCurrentFormId) {
      setCurrentFormId("education-form");
    }
    
    if (typeof window !== 'undefined') {
      window.educationFormSubmitted = false;
    }
    
    window.submitEducationForm = () => {
      if (localFormRef.current) {
        const submitButton = localFormRef.current.querySelector('#submit-education');
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.click();
          return true;
        }
      }
      return false;
    };
    
    return () => {
      delete window.submitEducationForm;
      delete window.educationFormSubmitted;
    };
  }, [formRef, setCurrentFormId]);

  useEffect(() => {
    if (formSubmitted && !isPending) {
      if (typeof window !== 'undefined') {
        window.educationFormSubmitted = true;
      }
      
      const timer = setTimeout(() => {
        router.push(onboardingRoutes.ACTIVITY);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formSubmitted, isPending, router]);

  const onSubmit = handleSubmit(async (formData) => {
    if (setIsSubmitting) {
      setIsSubmitting(true);
    }
    
    try {
      startTransition(async () => {
        const result = await submitEducation({
          ...formData,
          educationLevel
        });
        
        if (result.success) {
          SuccessToast();
          setFormSubmitted(true);
        } else {
          ErrorToast(result.error || "حدث خطأ أثناء حفظ المعلومات");
        }
      });
    } catch (error) {
      console.error("Error submitting education form:", error);
      ErrorToast("حدث خطأ أثناء حفظ المعلومات");
    } finally {
      if (setIsSubmitting) {
        setIsSubmitting(false);
      }
    }
  // }, (validationErrors) => {
  //   // Only show validation error if fields are missing
  //   const formValues = watch();
  //   if (formValues.educationLevel === 'student') {
  //     if (!formValues.studentInstitution || !formValues.studentFaculty || !formValues.studentProgram) {
  //       ErrorToast("اكمل المعلومات المطلوبة");
  //     }
  //   } else {
  //     ErrorToast("اكمل المعلومات المطلوبة");
  //   }
  });

  return (
    <form
      ref={localFormRef}
      onSubmit={onSubmit}
      className="p-2 h-[24rem] md:h-[13rem] flex flex-col mx-0 md:mx-auto"
      noValidate
    >
      <ScrollArea>
        <div dir="rtl" className="flex flex-col gap-6 px-6 w-full">
          <div className="pt-6">
            <DegreeSelector 
              setValue={setValue} 
              educationLevel={educationLevel} 
              setEducationLevel={setEducationLevel} 
            />      
          </div>
          {educationLevel && (
            <div>
              <Degree
                register={register}
                errors={{}}
                setValue={setValue}
                educationLevel={educationLevel}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      <button 
        id="submit-education" 
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