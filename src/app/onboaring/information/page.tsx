import { Suspense } from "react";
// import InformationForm from "@/components/onboarding/information/form";
import RefactoredForm from "@/components/onboarding/information/refactored-form";
import { getInformation } from "@/components/onboarding/information/action";

export default async function InformationPage() {
  const userData = await getInformation();
  
  // Transform userData to replace null values with undefined
  const transformedData = userData ? Object.fromEntries(
    Object.entries(userData).map(([key, value]) => [key, value === null ? undefined : value])
  ) : undefined;
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<div>Loading...</div>}>
        {/* Original form kept as backup
        <InformationForm 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        /> 
        */}
        <RefactoredForm 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
} 