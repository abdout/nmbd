import { Suspense } from "react";
import InformationForm from "@/components/onboarding/information/form";
import { getInformation } from "@/components/onboarding/information/action";

export default async function InformationPage() {
  const userData = await getInformation();
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <InformationForm 
          type={userData ? "update" : "create"} 
          data={userData || undefined} 
        />
      </Suspense>
    </div>
  );
} 