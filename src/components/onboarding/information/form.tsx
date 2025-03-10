'use client';
import { useState, useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { informationSchema } from "./validation";
import { createInformation, updateInformation } from "./action";
import type { InformationSchema } from "./validation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';
import Name from "./name";
import Location from "./location";
import Birthdate from "./birthdate";
import DegreeSelector from "./degree-selector";
import Degree from "./degree";

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

const Form = ({ type, data }: FormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Create refs for each form section
  const nameRowRef = useRef<HTMLDivElement>(null);
  const locationRowRef = useRef<HTMLDivElement>(null);
  const degreeSelectorRowRef = useRef<HTMLDivElement>(null);
  const degreeDetailsRowRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Always use the hook unconditionally at the top level
  const formContextValue = useFormContext();
  
  // Then safely handle the potential null case
  const formRef = formContextValue?.formRef;
  const setIsSubmitting = formContextValue?.setIsSubmitting;
  const setCurrentFormId = formContextValue?.setCurrentFormId;
  
  // Set up local form ref that we'll sync with context
  const localFormRef = useRef<HTMLFormElement>(null);
  
  // Education level state
  const [educationLevel, setEducationLevel] = useState<string>('student');

  // Add state for local storage data
  const [localStorageLoaded, setLocalStorageLoaded] = useState(false);

  // States to track row completion
  const [nameRowCompleted, setNameRowCompleted] = useState(false);
  const [locationRowCompleted, setLocationRowCompleted] = useState(false);
  const [birthdateRowCompleted, setBirthdateRowCompleted] = useState(false);
  const [degreeSelectorCompleted, setDegreeSelectorCompleted] = useState(false);

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

  // Get form values to track for auto-scrolling
  const fullname = watch('fullname');
  const currentCountry = watch('currentCountry');
  const currentState = watch('currentState');
  const currentLocality = watch('currentLocality');
  const birthYear = watch('birthYear');
  const birthMonth = watch('birthMonth');

  // Function to scroll to element with better handling of variable content
  const scrollToElement = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Get the element's position relative to the scrollable container
        const elementRect = elementRef.current.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top;
        
        // Calculate optimal position based on element height
        const elementHeight = elementRect.height;
        const containerHeight = containerRect.height;
        
        // If element is taller than container, scroll to top
        // Otherwise, center it if possible
        const targetOffset = elementHeight > containerHeight * 0.8 
          ? 10  // Just a small padding from top for tall elements
          : Math.max(10, (containerHeight - elementHeight) / 4); // Less center, more top-biased
        
        // Scroll to the element's position with smooth behavior
        scrollContainer.scrollTo({
          top: scrollContainer.scrollTop + relativeTop - targetOffset,
          behavior: 'smooth'
        });
      }
    }
  };

  // Watch for name field completion
  useEffect(() => {
    if (fullname && fullname.length > 3 && !nameRowCompleted) {
      setNameRowCompleted(true);
      // Scroll to location row when name is completed
      setTimeout(() => scrollToElement(locationRowRef), 500);
    }
  }, [fullname, nameRowCompleted, locationRowRef]);

  // Watch for location and birthdate completion
  useEffect(() => {
    // Check if location is selected
    if (currentCountry && currentState && currentLocality && !locationRowCompleted) {
      setLocationRowCompleted(true);
    }
    
    // Check if birthdate is completed
    if (birthYear && birthMonth && !birthdateRowCompleted) {
      setBirthdateRowCompleted(true);
    }
    
    // If both location and birthdate are completed, maximize scroll to degree selector
    if (locationRowCompleted && birthdateRowCompleted) {
      setTimeout(() => {
        if (degreeSelectorRowRef.current && scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            // Get maximum possible scroll to show degree selector fully
            const elementRect = degreeSelectorRowRef.current.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            
            // Calculate position to put element fully at the top
            const relativeTop = elementRect.top - containerRect.top + scrollContainer.scrollTop;
            
            // Apply maximum scroll with no offset for full top position
            scrollContainer.scrollTo({
              top: relativeTop, // no padding for full top view
              behavior: 'smooth'
            });
          }
        }
      }, 300);
    }
  }, [
    currentCountry, currentState, currentLocality,
    birthYear, birthMonth,
    locationRowCompleted, birthdateRowCompleted,
    degreeSelectorRowRef
  ]);

  // Watch for degree selection
  useEffect(() => {
    if (educationLevel) {
      setDegreeSelectorCompleted(true);
      
      // Wait for the DOM to update with the new degree components
      setTimeout(() => {
        if (degreeDetailsRowRef.current) {
          scrollToElement(degreeDetailsRowRef);
        }
      }, 100);
    }
  }, [educationLevel, degreeSelectorCompleted, degreeDetailsRowRef]);

  // Handle degree-specific components scrolling
  const prevEducationLevelRef = useRef(educationLevel);
  
  useEffect(() => {
    // Only run when educationLevel changes (not on initial render)
    if (prevEducationLevelRef.current !== educationLevel && prevEducationLevelRef.current) {
      // Different timing for different degree types
      setTimeout(() => {
        if (degreeDetailsRowRef.current) {
          scrollToElement(degreeDetailsRowRef);
        }
      }, 300);
    }
    
    // Update the ref with current value for next comparison
    prevEducationLevelRef.current = educationLevel;
  }, [educationLevel, degreeDetailsRowRef]);

  // Load form values when data prop changes (e.g., when data is fetched from the server)
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      console.log('Server data received:', data);
      
      // Reset form with server data, giving it priority over localStorage
      reset(data);
      
      // If education level is provided, update state
      if (data.educationLevel) {
        setEducationLevel(data.educationLevel);
      }
      
      // toast.success('Loaded data from server');
      
      // Also save to localStorage to ensure consistency
      try {
        localStorage.setItem('informationFormData', JSON.stringify(data));
        console.log('Saved server data to localStorage for later use');
      } catch (error) {
        console.error('Error saving server data to localStorage:', error);
      }
    } else if (!data && !localStorageLoaded) {
      // If no server data, try to load from localStorage
      try {
        const savedData = localStorage.getItem('informationFormData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('No server data, loading from localStorage:', parsedData);
          
          // Reset form with localStorage data
          reset(parsedData);
          
          // If education level is stored, update state
          if (parsedData.educationLevel) {
            setEducationLevel(parsedData.educationLevel);
          }
          
          toast.success("Loaded previously saved data");
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      
      setLocalStorageLoaded(true);
    }
  }, [data, reset, localStorageLoaded, setLocalStorageLoaded]);

  // Register form in global window for debug access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.submitInformationForm = () => {
        console.log('Global submit function called');
        if (localFormRef.current) {
          console.log('Submitting form via global function');
          const submitButton = localFormRef.current.querySelector('#submit-information') as HTMLButtonElement;
          if (submitButton) {
            submitButton.click();
            return true;
          }
        }
        return false;
      };
      
      return () => {
        delete window.submitInformationForm;
      };
    }
  }, [localFormRef]);

  useEffect(() => {
    // Set form reference for ButtonNavigation if context is available
    if (formRef && localFormRef.current) {
      try {
        formRef.current = localFormRef.current;
        console.log('Form reference set successfully', formRef.current);
      } catch {
        console.error('Error setting form reference:');
      }
    }
    
    try {
      setCurrentFormId?.('information');
    } catch {
      console.log('Unable to set current form ID');
    }
    
    // Set education level to student as default and update form value
    setValue('educationLevel', 'student');
  }, [formRef, setCurrentFormId, setValue]);

  // Add this function before onSubmitHandler
  const scrollToFirstError = () => {
    // Get the first error field
    const firstErrorField = Object.keys(errors)[0];
    if (!firstErrorField) return;

    // Find the element with the error
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Listen for degree content rendered event
  useEffect(() => {
    const handleDegreeContentRendered = (event: Event) => {
      const customEvent = event as CustomEvent;
      // Check if it's a different degree than before
      if (customEvent.detail?.educationLevel !== prevEducationLevelRef.current) {
        // Scroll to degree details after content is rendered
        setTimeout(() => {
          if (degreeDetailsRowRef.current) {
            scrollToElement(degreeDetailsRowRef);
          }
        }, 100);
      }
    };

    document.addEventListener('degreeContentRendered', handleDegreeContentRendered);
    
    return () => {
      document.removeEventListener('degreeContentRendered', handleDegreeContentRendered);
    };
  }, []);

  // Handle the actual form submission logic
  const onSubmitHandler = (formData: InformationSchema) => {
    console.log('Form submission triggered with data:', formData);
    
    // Get all validation errors
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      console.error('Form has validation errors:', errors);
      
      // Create a detailed error message in Arabic
      let errorMessage = 'يرجى تصحيح الأخطاء التالية:';
      
      // Add specific field errors to the message
      errorFields.forEach(field => {
        const fieldError = errors[field as keyof typeof errors];
        if (fieldError) {
          // Map field names to Arabic
          let arabicFieldName = '';
          switch(field) {
            case 'fullName': arabicFieldName = 'الاسم الكامل'; break;
            case 'birthCountry': arabicFieldName = 'دولة الميلاد'; break;
            case 'birthState': arabicFieldName = 'ولاية الميلاد'; break;
            case 'birthLocality': arabicFieldName = 'محلية الميلاد'; break;
            case 'birthYear': arabicFieldName = 'سنة الميلاد'; break;
            case 'birthMonth': arabicFieldName = 'شهر الميلاد'; break;
            case 'currentCountry': arabicFieldName = 'الدولة الحالية'; break;
            case 'currentState': arabicFieldName = 'الولاية الحالية'; break;
            case 'currentLocality': arabicFieldName = 'المحلية الحالية'; break;
            case 'currentAdminUnit': arabicFieldName = 'الوحدة الإدارية'; break;
            case 'currentNeighborhood': arabicFieldName = 'الحي'; break;
            case 'educationLevel': arabicFieldName = 'المستوى التعليمي'; break;
            case 'educationField': arabicFieldName = 'مجال الدراسة'; break;
            case 'educationSpecialization': arabicFieldName = 'التخصص'; break;
            default: arabicFieldName = field;
          }
          
          errorMessage += `\n• ${arabicFieldName}`;
        }
      });
      
      // Show toast with detailed error message and red styling
      toast.error(errorMessage, {
        style: {
          background: 'rgb(239 68 68)',
          color: 'white',
          border: 'none',
          textAlign: 'right',
          direction: 'rtl'
        },
        duration: 5000 // Show for 5 seconds to give user time to read
      });
      
      // Log all error fields to console
      errorFields.forEach(field => {
        const fieldError = errors[field as keyof typeof errors];
        if (fieldError) {
          console.error(`Field ${field} error:`, fieldError.message);
        }
      });
      
      // Scroll to the first error
      scrollToFirstError();
      
      return;
    }
    
    // Ensure birthYear and birthMonth are strings before submission
    const processedFormData = {
      ...formData,
      birthYear: formData.birthYear?.toString() || '',
      birthMonth: formData.birthMonth?.toString() || ''
    };
    
    // Save to localStorage for persistence between page visits
    try {
      localStorage.setItem('informationFormData', JSON.stringify(processedFormData));
      console.log('Saved form data to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    startTransition(async () => {
      try {
        console.log('Starting form submission transition');
        if (setIsSubmitting) {
          console.log('Setting isSubmitting to true');
          setIsSubmitting(true);
        }
        
        const minimalData = {
          ...processedFormData,
        };

        console.log("Submitting minimal data:", minimalData);

        console.log('Form submission type:', type);

        if (type === "create") {
          console.log('Creating information...');
          try {
            // Instead of FormData, pass the object directly for clarity
            console.log('Calling createInformation with:', minimalData);
            
            // Call the server action directly with the data object
            const result = await createInformation({ success: false, error: false }, minimalData);
            console.log('Create information result:', result);

            if (result.success) {
              console.log('Information created successfully');
              toast.success("تم تحديث البيانات بنجاح");
              router.push(getNextRoute(pathname));
            } else {
              console.error('Failed to create information');
              toast.error(result.error || "Failed to create information");
            }
          } catch (error) {
            console.error('Error during creation:', error);
            toast.error("An error occurred during form submission");
          }
        } else {
          console.log('Updating information...');
          try {
            // Instead of FormData, pass the object directly for clarity
            console.log('Calling updateInformation with:', minimalData);
            
            // Call the server action directly with the data object
            const result = await updateInformation({ success: false, error: false }, minimalData);
            console.log('Update information result:', result);

            if (result.success) {
              console.log('Information updated successfully');
              toast.success("تم تحديث البيانات بنجاح");
              router.push(getNextRoute(pathname));
            } else {
              console.error('Failed to update information');
              toast.error(result.error || "Failed to update information");
            }
          } catch (error) {
            console.error('Error during update:', error);
            toast.error("An error occurred during form submission");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An error occurred while submitting the form");
      } finally {
        console.log('Form submission completed');
        if (setIsSubmitting) {
          console.log('Setting isSubmitting to false');
          setIsSubmitting(false);
        }
      }
    });
  };

  return (
    <form
      ref={localFormRef}
      onSubmit={handleSubmit(onSubmitHandler)}
      className="h-[13rem] flex flex-col -mt-2 mx-auto"
      noValidate
    >
      <ScrollArea ref={scrollAreaRef} className="">
        <div dir="rtl" className="flex flex-col gap-6 px-6 w-full ">
          <div ref={nameRowRef}>
            <Name register={register} errors={errors} />
          </div>
          {/* <div>
            <ID register={register} errors={errors} setValue={setValue} watch={watch} />
          </div> */}
          
          {/* Use a grid layout with lower gap and additional container styling */}
          <div 
            ref={locationRowRef} 
            className="flex flex-col gap-6"
          >
            <div dir="rtl" className="grid grid-cols-2 gap-6">
              <div className="relative">
                <Location
                  register={register}
                  errors={errors}
                  setValue={setValue}
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

            {/* <div>
              <Bio register={register} errors={errors} />
            </div> */}
          </div>

          <div ref={degreeSelectorRowRef} className="pt-6">
            <DegreeSelector 
              setValue={setValue} 
              educationLevel={educationLevel} 
              setEducationLevel={setEducationLevel} 
            />      
          </div>
          {educationLevel && (
            <div ref={degreeDetailsRowRef}>
              <Degree
                register={register}
                errors={errors}
                setValue={setValue}
                educationLevel={educationLevel}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Submit button */}
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