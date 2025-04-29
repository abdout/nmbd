import { Suspense } from "react";
import Form from "@/components/onboarding/education/form";
import { getInformation } from "@/components/onboarding/information/action";
import type { InformationSchema } from "@/components/onboarding/information/validation";
import Loading from "@/components/atom/loading";

export default async function EducationPage() {
  const userData = await getInformation();
  
  // Transform userData to replace null values with undefined and ensure type safety
  const transformedData: InformationSchema | undefined = userData ? {
    ...Object.fromEntries(
      Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
    )
  } as InformationSchema : undefined;
  
  return (
    <div className="w-full md:w-[55%] mx-auto">
      <Suspense fallback={<Loading />}>
        <Form 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
} 