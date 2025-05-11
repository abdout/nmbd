"use server";

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import type { ContributeSchema } from "./validation";
import { contributeSchema } from "./validation";

export async function getContribute() {
  const user = await currentUser();
  if (!user?.id) return { contribution: '' };
  const userData = await db.user.findUnique({
    where: { id: user.id },
    select: { contribute: true }
  });
  return { contribution: userData?.contribute || '' };
}

export async function createContribute(formData: ContributeSchema) {
  const user = await currentUser();
  if (!user?.id) return { success: false };
  const validated = contributeSchema.safeParse(formData);
  if (!validated.success) return { success: false };
  await db.user.update({
    where: { id: user.id },
    data: { contribute: validated.data.contribution }
  });
  return { success: true };
} 