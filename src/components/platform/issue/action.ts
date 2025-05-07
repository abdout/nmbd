"use server";

import { db } from '@/lib/db';
import { issueFormSchema, IssueFormValues } from './validation';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Create a new issue
export async function createIssue(data: IssueFormValues) {
  const parsed = issueFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Validation failed', details: parsed.error.flatten() };
  }
  const { repository, ...otherData } = parsed.data;
  
  // Only include repository connection if a valid repository ID is provided
  const cleanData = {
    ...otherData,
    ...(repository && repository.length === 24 && {
      repository: {
        connect: { id: repository }
      }
    }),
    issue: otherData.issue || "",
    club: otherData.club || "",
    label: otherData.label || "",
  };

  try {
    const newIssue = await db.issue.create({ data: cleanData });
    revalidatePath('/issue');
    return { success: true, issueId: newIssue.id };
  } catch (error) {
    console.error('Error creating issue:', error);
    return { error: 'Failed to create issue' };
  }
}

// Get all issues
export async function getIssues() {
  try {
    const issues = await db.issue.findMany({
      include: {
        repository: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Return all issues without filtering
    return { success: true, issues: issues };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching issues:', error);
      return { error: error.message, issues: [] };
    }
    return { error: 'Failed to fetch issues', issues: [] };
  }
}

// Get a single issue by ID
export async function getIssue(id: string) {
  const issue = await db.issue.findUnique({ where: { id } });
  if (!issue) {
    return { error: 'Issue not found' };
  }
  return { success: true, issue };
}

// Update an issue by ID
export async function updateIssue(id: string, data: Partial<IssueFormValues>) {
  const parsed = issueFormSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { error: 'Validation failed', details: parsed.error.flatten() };
  }
  const { repository, ...otherData } = parsed.data;
  
  // Only include repository connection if a valid repository ID is provided
  const cleanData = {
    ...otherData,
    ...(repository && repository.length === 24 && {
      repository: {
        connect: { id: repository }
      }
    })
  };

  try {
    const updatedIssue = await db.issue.update({ where: { id }, data: cleanData });
    revalidatePath('/issue');
    return { success: true, issue: updatedIssue };
  } catch (error) {
    console.error('Error updating issue:', error);
    return { error: 'Failed to update issue' };
  }
}

// Delete an issue by ID
export async function deleteIssue(id: string) {
  try {
    const deletedIssue = await db.issue.delete({ where: { id } });
    if (!deletedIssue) {
      return { error: 'Issue not found' };
    }
    revalidatePath('/issue');
    return { success: true };
  } catch (error) {
    console.error('Error deleting issue:', error);
    return { error: 'Failed to delete issue' };
  }
}
