import { currentUser } from "@/lib/auth";
import ActivityForm from "@/components/onboarding/activity/form";
import { Suspense } from "react";
import { db } from "@/lib/db";
import MobileActivityForm from "@/components/onboarding/activity/mobile-form";
async function getActivityData() {
  try {
    const user = await currentUser();
    if (!user?.id) return null;

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        partyMember: true,
        partyName: true,
        partyStartDate: true,
        partyEndDate: true,
        unionMember: true,
        unionName: true,
        unionStartDate: true,
        unionEndDate: true,
        ngoMember: true,
        ngoName: true,
        ngoActivity: true,
        clubMember: true,
        clubName: true,
        clubType: true,
      }
    });

    return userData;
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return null;
  }
}

export default async function ActivityPage() {
  const userData = await getActivityData();
  
  if (!userData) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
      <div className="hidden md:block">
        <ActivityForm user={userData} />
      </div>
      <div className="block md:hidden">
        <MobileActivityForm user={userData} />
      </div>
      </Suspense>
    </div>
  );
} 