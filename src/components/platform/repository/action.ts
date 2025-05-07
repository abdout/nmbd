'use server'

import { db } from "@/lib/db";
import { validateRepository } from "@/components/platform/repository/validation";
import { revalidatePath } from "next/cache";

export async function getRepositories() {
  try {
    const repositories = await db.repository.findMany({
      include: {
        issues: true,
      },
    });
    return { repositories };
  } catch (error) {
    throw new Error("Failed to fetch repositories");
  }
}

export async function getRepository(id: string) {
  try {
    const repository = await db.repository.findUnique({
      where: { id },
      include: {
        issues: true,
      },
    });
    if (!repository) throw new Error("Repository not found");
    return { repository };
  } catch (error) {
    throw new Error("Failed to fetch repository");
  }
}

export async function createRepository(data: {
  title: string;
  desc: string;
  club: string;
  status: string;
  readme: string;
  roadmap: string;
  contributor: string;
  material: string;
  chat: string;
}) {
  try {
    const validationResult = validateRepository(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error);
    }

    const validData = validationResult.data!;
    const repository = await db.repository.create({
      data: {
        title: validData.title || '',
        desc: validData.desc || '',
        club: validData.club || '',
        status: validData.status || '',
        readme: validData.readme || '',
        roadmap: validData.roadmap || '',
        contributor: validData.contributor || '',
        material: validData.material || '',
        chat: validData.chat || '',
      }
    });

    revalidatePath('/repository');
    return { repository };
  } catch (error) {
    throw new Error("Failed to create repository");
  }
}

export async function updateRepository(id: string, data: Partial<{
  title: string;
  desc: string;
  club: string;
  status: string;
  readme: string;
  roadmap: string;
  contributor: string;
  material: string;
  chat: string;
}>) {
  try {
    const validationResult = validateRepository(data, true);
    if (!validationResult.success) {
      throw new Error(validationResult.error);
    }

    const validData = validationResult.data!;
    const repository = await db.repository.update({
      where: { id },
      data: {
        ...(validData.title && { title: validData.title }),
        ...(validData.desc && { desc: validData.desc }),
        ...(validData.club && { club: validData.club }),
        ...(validData.status && { status: validData.status }),
        ...(validData.readme && { readme: validData.readme }),
        ...(validData.roadmap && { roadmap: validData.roadmap }),
        ...(validData.contributor && { contributor: validData.contributor }),
        ...(validData.material && { material: validData.material }),
        ...(validData.chat && { chat: validData.chat }),
      }
    });

    revalidatePath('/repository');
    revalidatePath(`/repository/${id}`);
    return { repository };
  } catch (error) {
    throw new Error("Failed to update repository");
  }
}

export async function deleteRepository(id: string) {
  try {
    await db.repository.delete({
      where: { id },
    });

    revalidatePath('/repository');
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete repository");
  }
} 