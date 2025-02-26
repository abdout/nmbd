'use client';
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { onboardingRoutes } from './types'
import { useTransition } from "react";
import { useFormContext } from './form-context';
import { getNextRoute, getPreviousRoute } from './utils';

// Custom event to trigger form submission
export const triggerFormSubmit = () => {
    console.log('Dispatching global form submit event');
    // Create and dispatch a custom event
    const submitEvent = new Event('submit-form', { bubbles: true });
    window.dispatchEvent(submitEvent);
    
    // Try the global function approach as well
    try {
        if ((window as any).submitInformationForm) {
            console.log('Using global submit function');
            (window as any).submitInformationForm();
            return true;
        }
    } catch (e) {
        console.error('Error calling global submit function:', e);
    }
    
    return false;
};

const ButtonNavigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    
    // Try to use form context, but don't fail if it's not available
    let formContextValue = null;
    try {
        formContextValue = useFormContext();
    } catch (error) {
        console.log('Form context not available, continuing without it');
    }
    
    const { formRef, currentFormId } = formContextValue || { formRef: null, currentFormId: null };

    const handleNext = async () => {
        console.log('Next button clicked, formRef:', formRef?.current);
        console.log('Current form ID:', currentFormId);
        
        // Try to submit the form if it exists
        if (formRef?.current) {
            console.log('Form exists, attempting to submit');
            try {
                // Try to find and click the debug submit button first (most reliable)
                const debugButtonId = `#debug-submit-${currentFormId}`;
                const debugButton = document.querySelector(debugButtonId) as HTMLButtonElement;
                if (debugButton) {
                    console.log(`Found debug button ${debugButtonId}, clicking it`);
                    debugButton.click();
                    return;
                }
                
                // Use global function if available
                if (currentFormId === 'information' && (window as any).submitInformationForm) {
                    console.log('Using global submit function for information form');
                    if ((window as any).submitInformationForm()) {
                        return;
                    }
                }
                
                // Use requestSubmit() as a fallback
                const formElement = formRef.current as HTMLFormElement;
                console.log('Using requestSubmit on form');
                formElement.requestSubmit();
                console.log('Form submission requested');
                return;
            } catch (error) {
                console.error('Error submitting form:', error);
            }
            
            // Fallback to the submit button if requestSubmit fails
            const submitButton = formRef.current.querySelector(
                `#submit-${currentFormId}`
            ) as HTMLButtonElement;
            
            if (submitButton) {
                console.log(`Clicking submit button #submit-${currentFormId}`);
                try {
                    submitButton.click();
                    return;
                } catch (clickError) {
                    console.error('Error clicking submit button:', clickError);
                }
            } else {
                console.error(`Submit button #submit-${currentFormId} not found`);
            }
        } else {
            console.warn('Form reference is null or undefined');
        }
        
        // If all else fails, just navigate to the next route
        const nextRoute = getNextRoute(pathname);
        console.log('Failed to submit form, navigating to:', nextRoute);
        toast.error('Failed to submit form, navigating to next step anyway');
        router.push(nextRoute);
    };

    const handlePrevious = () => {
        const prevRoute = getPreviousRoute(pathname);
        router.push(prevRoute);
    };

    return (
        <div className="flex justify-center space-x-reverse space-x-4">
            <Button 
                onClick={handlePrevious}
                size="sm" 
                className='bg-neutral-950 hover:bg-neutral-800'
            >
                <ArrowRight className="ml-2 h-4 w-4" /> السابق
            </Button>
            <Button 
                onClick={handleNext}
                variant="outline" 
                size="sm"
                disabled={isPending}
            >
                {isPending ? "جاري الحفظ..." : "التالي"} 
                <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
        </div>
    );
};

export default ButtonNavigation;



