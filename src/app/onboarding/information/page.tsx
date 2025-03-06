import { Suspense } from "react";
import Form from "@/components/onboarding/information/form";
import { getInformation } from "@/components/onboarding/information/action";
import type { InformationSchema } from "@/components/onboarding/information/validation";
import MobileForm from "@/components/onboarding/information/mobile-form";

export default async function InformationPage() {
  const userData = await getInformation();
  
  // Transform userData to replace null values with undefined and ensure type safety
  const transformedData: InformationSchema | undefined = userData ? {
    ...Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
    )
  } as InformationSchema : undefined;
  
  return (
    <div className="w-full md:w-[55%] md:mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        {/* Original form kept as backup
        <InformationForm 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        /> 
        */}
        <div className="hidden md:block">
          <Form 
            type={userData ? "update" : "create"} 
            data={transformedData} 
          />
        </div>
        <div className="block md:hidden">
          <MobileForm 
            type={userData ? "update" : "create"} 
            data={transformedData} 
          />
        </div>
      </Suspense>
    </div>
  );
} 