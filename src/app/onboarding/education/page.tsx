import { Suspense } from "react";
import { redirect } from "next/navigation";
import Form from "@/components/onboarding/education/form";
import { getInformation } from "@/components/onboarding/information/action";
import { getEducation } from "@/components/onboarding/education/action";
import type { InformationSchema } from "@/components/onboarding/information/validation";
import Loading from "@/components/atom/loading";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { onboardingRoutes } from "@/routes";

export default async function EducationPage() {
  // Get current user and check onboarding status
  const user = await currentUser();
  
  if (!user?.email) {
    redirect("/login");
  }

  // Check if user exists in database and get onboarding step
  const dbUser = await db.user.findUnique({
    where: { email: user.email },
    select: { onboardingStep: true }
  });

  if (!dbUser) {
    redirect("/login");
  }

  // If user hasn't completed information step or onboardingStep is null, redirect to information
  if (!dbUser.onboardingStep || dbUser.onboardingStep < 2) {
    redirect(onboardingRoutes.INFORMATION);
  }

  // Get existing education data if any
  const educationData = await getEducation();
  
  // Transform userData to replace null values with undefined and ensure type safety
  const transformedData: InformationSchema | undefined = educationData ? {
    ...Object.fromEntries(
      Object.entries(educationData).map(([key, value]) => [key, value === null ? undefined : value])
    )
  } as InformationSchema : undefined;
  
  return (
    <div className="w-full md:w-[55%] mx-auto">
      <Suspense fallback={<Loading />}>
        <Form 
          type={educationData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
} 