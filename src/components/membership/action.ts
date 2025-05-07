// Server actions for membership application status and onboarding status
"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

// Approve application: sets applicationStatus to "APPROVED"
export async function approveApplication(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: userId },
    data: {
      applicationStatus: "APPROVED",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });
  return { success: true };
}

// Reject application: sets applicationStatus to "REJECTED"
export async function rejectApplication(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await db.user.update({
    where: { id: userId },
    data: {
      applicationStatus: "REJECTED",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });
  return { success: true };
}

// Redo application: sets applicationStatus back to "PENDING"
export async function redoApplication(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await db.user.update({
    where: { id: userId },
    data: {
      applicationStatus: "PENDING",
      reviewedBy: null,
      reviewedAt: null,
    },
  });
  return { success: true };
}

// Set onboarding status (optional, for completeness)
export async function setOnboardingStatus(userId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  await db.user.update({
    where: { id: userId },
    data: {
      onboardingStatus: status,
    },
  });
  return { success: true };
}

// Set user role
export async function updateUserRole(userId: string, role: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  try {
    await db.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
    });
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
