'use client';
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { onboardingRoutes } from './types'
import { useTransition } from "react";
import { updateUser } from "@/lib/action";

const ButtonNavigation = ({ 
  formRef 
}: { 
  formRef?: React.RefObject<HTMLFormElement | null> 
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const getCurrentStepIndex = (path: string): number => {
        return Object.values(onboardingRoutes).findIndex(
            route => path.includes(route.split('/').pop() || '')
        ) + 1;
    };

    const getNextRoute = (currentPath: string): string => {
        const routes = Object.values(onboardingRoutes) as string[];
        const currentIndex = routes.indexOf(currentPath);
        return routes[currentIndex + 1] || routes[currentIndex];
    };

    const getPreviousRoute = (currentPath: string): string => {
        const routes = Object.values(onboardingRoutes) as string[];
        const currentIndex = routes.indexOf(currentPath);
        return routes[currentIndex - 1] || routes[currentIndex];
    };

    const handleNext = () => {
        if (formRef?.current) {
            // Trigger form validation
            const isValid = formRef.current.checkValidity();
            if (!isValid) {
                toast.error("يرجى إكمال جميع الحقول المطلوبة");
                formRef.current.reportValidity();
                return;
            }

            // Submit form data optimistically
            startTransition(async () => {
                const formData = new FormData(formRef.current!);
                const result = await updateUser({ success: false, error: false }, {
                    ...Object.fromEntries(formData),
                    currentStep: getCurrentStepIndex(pathname),
                    role: "USER",
                    isTwoFactorEnabled: false,
                    skills: [],
                    languageSkills: []
                });

                if (result.success) {
                    toast.success("تم حفظ البيانات");
                    router.push(getNextRoute(pathname));
                } else {
                    toast.error("حدث خطأ أثناء حفظ البيانات");
                }
            });
        } else {
            router.push(getNextRoute(pathname));
        }
    };

    return (
        <div className="flex justify-center space-x-reverse space-x-4">
            <Button 
                onClick={() => router.push(getPreviousRoute(pathname))} 
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



