'use client';
import { useState, useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { informationSchema } from "./validation";
import { createInformation, updateInformation } from "./action";
import type { InformationSchema } from "./validation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';

import Name from "./name";
import ID from "./id";
import Location from "./location";
import Birthdate from "./birthdate";
import Bio from "./bio";
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

const RefactoredForm = ({ type, data }: FormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const bioSectionRef = useRef<HTMLDivElement>(null);
  
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

  // Watch ID section fields
  const maritalStatus = watch('maritalStatus');
  const gender = watch('gender');
  const religion = watch('religion');
  const nationalityId = watch('nationalityId');

  // Watch location and birthdate fields
  const locationFields = watch(['currentCountry', 'currentState', 'currentLocality', 'currentAdminUnit', 'currentNeighborhood']);
  const birthdateFields = watch(['birthCountry', 'birthState', 'birthLocality', 'birthYear', 'birthMonth']);

  // Calculate if each section is complete
  const isIdComplete = [maritalStatus, gender, religion, nationalityId].every(field => field);

  // Check if ID section is complete and scroll to next section
  useEffect(() => {
    if (isIdComplete) {
      // Small delay to ensure the user has finished typing/selecting
      const timer = setTimeout(() => {
        if (locationSectionRef.current) {
          // Scroll into view with start positioning
          locationSectionRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isIdComplete, locationSectionRef]);

  // Fix useEffect dependencies and avoid spread in dependency array
  useEffect(() => {
    // Check if all location fields are filled
    const isLocationComplete = locationFields.every(field => field);
    
    // Check if all birthdate fields are filled
    const isBirthdateComplete = birthdateFields.every(field => field);

    // If both sections are complete, scroll to bio section
    if (isLocationComplete && isBirthdateComplete) {
      const timer = setTimeout(() => {
        if (bioSectionRef.current) {
          bioSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [locationFields, birthdateFields, bioSectionRef]);

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
      
      toast.success('Loaded data from server');
      
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

  // Handle the actual form submission logic
  const onSubmitHandler = (formData: InformationSchema) => {
    console.log('Form submission triggered with data:', formData);
    
    // Get all validation errors
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      console.error('Form has validation errors:', errors);
      toast.error(`Please fix ${errorFields.length} validation errors`);
      
      // Log all error fields
      errorFields.forEach(field => {
        const fieldError = errors[field as keyof typeof errors];
        if (fieldError) {
          console.error(`Field ${field} error:`, fieldError.message);
        }
      });
      
      return;
    }
    
    // Validate important fields before submission
    if (!formData.name || !formData.name.trim()) {
      console.error('Name is required but missing');
      toast.error('Name is required');
      return;
    }
    
    // Save to localStorage for persistence between page visits
    try {
      localStorage.setItem('informationFormData', JSON.stringify(formData));
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
          ...formData,
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
              toast.success("Information created successfully!");
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
              toast.success("Information updated successfully!");
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

  // For testing
  // Commented out unused test function
  // const fillWithTestData = () => {
  //   const testData = {
  //     name: "John",
  //     fullname: "John Doe",
  //     bio: "Software engineer with 5+ years of experience",
  //     studentYear: "Second",
  //     maritalStatus: "Single",
  //     gender: "Male"
  //   };
  //   // Set all values in the form
  // }

  return (
    <form
    
      ref={localFormRef}
      onSubmit={handleSubmit(onSubmitHandler)}
      className="h-[13rem] flex flex-col -mt-2 mx-auto"
      noValidate
    >
      <ScrollArea className="">
        <div dir="rtl" className="flex flex-col gap-6 px-6 w-full ">
          <div>
            <Name register={register} errors={errors} />
          </div>
          <div>
            <ID register={register} errors={errors} setValue={setValue} watch={watch} />
          </div>
          
          {/* Use a grid layout with lower gap and additional container styling */}
          <div 
            ref={locationSectionRef} 
            className="flex flex-col gap-6"
          >
            <div dir="rtl" className="grid grid-cols-2 gap-6">
              <div className="relative">
                <Location
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
              </div>
              
              <div className="relative">
                <Birthdate
                  register={register}
                  errors={errors}
                  setValue={setValue}
                />
              </div>
            </div>

            <div ref={bioSectionRef}>
              <Bio register={register} errors={errors} />
            </div>
          </div>

          <div>
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

      {/* Debug submit button */}
      <div className="fixed bottom-4 right-4 z-50  gap-2 ">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => {
            try {
              const savedData = localStorage.getItem('informationFormData');
              if (savedData) {
                const parsedData = JSON.parse(savedData);
                console.log('Current localStorage data:', parsedData);
                toast.success("Found saved data - check console");
              } else {
                toast.error("No saved data found");
              }
            } catch (error) {
              console.error('Error reading localStorage:', error);
              toast.error("Error reading saved data");
            }
          }}
        >
          View Saved Data
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => {
            console.log('Server data prop:', data);
            console.log('Current form values:', watch());
            console.log('Form errors:', errors);
            toast.success('Data info logged to console');
          }}
        >
          Debug Data
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => {
            // Sample test data with Arabic values
            const testData = {
              name: 'أحمد محمد',
              fullname: 'أحمد محمد علي',
              bio: 'هذا النص تجريبي لاختبار النموذج',
              birthMonth: '5',
              birthYear: '1990',
              birthCountry: 'السودان',
              birthState: 'ولاية الخرطوم',
              birthLocality: 'محلية الخرطوم',
              educationLevel: 'student',
              studentInstitution: 'جامعة الخرطوم',
              studentFaculty: 'كلية الهندسة',
              studentYear: '3',
              maritalStatus: 'أعزب',
              gender: 'ذكر',
              religion: 'الإسلام',
              nationalityId: '1234567890'
            };
            
            // Set all values in the form
            Object.entries(testData).forEach(([key, value]) => {
              setValue(key as keyof InformationSchema, value as string);
            });
            
            // Update education level state
            if (testData.educationLevel) {
              setEducationLevel(testData.educationLevel);
            }
            
            toast.success('تم ملء النموذج ببيانات تجريبية');
          }}
        >
          Fill Test Data
        </Button>
        <Button 
          type="button" 
          variant="destructive" 
          size="sm" 
          onClick={handleSubmit(onSubmitHandler)}
          className="animate-pulse"
          id="debug-submit-information"
        >
          Debug Submit
        </Button>
      </div>
    </form>
  );
};

export default RefactoredForm; 