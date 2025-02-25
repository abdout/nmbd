'use client';
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { onboardingRoutes } from './types'
import { useTransition } from "react";
import { useFormContext } from './form-context';
import { getNextRoute, getPreviousRoute } from './utils';

const ButtonNavigation = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const { formRef, currentFormId } = useFormContext();

    const getCurrentStepIndex = (path: string): number => {
        return Object.values(onboardingRoutes).findIndex(
            route => path.includes(route.split('/').pop() || '')
        ) + 1;
    };

    const handleNext = async () => {
        if (formRef?.current) {
            const submitButton = formRef.current.querySelector(
                '#submit-activity, #submit-contact, #submit-information, #submit-attachment'
            ) as HTMLButtonElement;
            
            if (submitButton) {
                submitButton.click();
                return;
            }
        }
        
        const nextRoute = getNextRoute(pathname);
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



