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
  
  try {
    // Check if repository ID exists if provided
    if (repository) {
      const repoExists = await db.repository.findUnique({
        where: { id: repository }
      });
      
      if (!repoExists) {
        return { error: 'Repository not found, please select a valid repository' };
      }
    }
    
    // Only include repository connection if a valid repository ID is provided
    const cleanData = {
      ...otherData,
      ...(repository && {
        repository: {
          connect: { id: repository }
        }
      }),
      issue: otherData.issue || "",
      club: otherData.club || "",
      label: otherData.label || "",
    };

    const newIssue = await db.issue.create({ data: cleanData });
    revalidatePath('/issue');
    return { success: true, issueId: newIssue.id };
  } catch (error) {
    console.error('Error creating issue:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2023') {
        return { error: 'Invalid ID format for repository' };
      }
      if (error.code === 'P2025') {
        return { error: 'Repository not found' };
      }
    }
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

    // Map issues to include repository title
    const mappedIssues = issues.map(issue => ({
      ...issue,
      repositoryTitle: issue.repository?.title || null
    }));

    // Return all issues without filtering
    return { success: true, issues: mappedIssues };
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
  const issue = await db.issue.findUnique({ 
    where: { id },
    include: { repository: true }
  });
  if (!issue) {
    return { error: 'Issue not found' };
  }
  // Add repositoryTitle to match getIssues
  return { success: true, issue: { ...issue, repositoryTitle: issue.repository?.title || null } };
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
