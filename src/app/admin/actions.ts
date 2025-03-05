'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

interface AssignRoleParams {
  email: string;
  role: 'ADMIN' | 'USER' | 'MEMBERSHIP_SECRETARY';
}

export async function assignRole(params: AssignRoleParams): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await currentUser();
    
    // Check if current user is authorized (must be an admin)
    if (!user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const currentUserData = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });
    
    if (currentUserData?.role !== 'ADMIN') {
      return { success: false, error: 'Only administrators can assign roles' };
    }
    
    // Find the user by email
    const targetUser = await db.user.findUnique({
      where: { email: params.email },
      select: { id: true, name: true, email: true }
    });
    
    if (!targetUser) {
      return { success: false, error: 'User not found with this email' };
    }
    
    // Update the user's role
    await db.user.update({
      where: { id: targetUser.id },
      data: { role: params.role }
    });
    
    // Log the action
    console.log(`Admin ${user.email} changed role of ${targetUser.email} to ${params.role}`);
    
    // Revalidate paths that might display user information
    revalidatePath('/membership/applications');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, error: 'Failed to assign role' };
  }
} 