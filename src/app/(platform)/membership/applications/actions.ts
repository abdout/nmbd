// 'use server';

// import { db } from '@/lib/db';
// import { currentUser } from '@/lib/auth';
// import { revalidatePath } from 'next/cache';
// // import { redirect } from 'next/navigation';
// import { notifyApplicationApproved, notifyApplicationRejected } from '@/lib/notification';

// /**
//  * Fetch pending applications for membership secretary to review
//  */
// export async function fetchPendingApplications() {
//   try {
//     const user = await currentUser();
    
//     if (!user?.id) {
//       throw new Error("Unauthorized");
//     }
    
//     // Check if user is membership secretary or admin
//     const userData = await db.user.findUnique({
//       where: { id: user.id },
//       select: { role: true }
//     });
    
//     if (userData?.role !== 'MEMBERSHIP_SECRETARY' && userData?.role !== 'ADMIN') {
//       throw new Error("Unauthorized - Only membership secretary or admin can access applications");
//     }
    
//     // Fetch all completed applications
//     const applications = await db.user.findMany({
//       where: {
//         onboardingStatus: "COMPLETED",
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         fullname: true,
//         phone: true,
//         image: true,
//         createdAt: true,
//         onboardingStatus: true,
//         applicationStatus: true,
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
    
//     // Remove temporary applicationStatus property
//     return applications;
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     throw error;
//   }
// }

// /**
//  * Approve a membership application
//  */
// export async function approveApplication(applicationId: string, notes?: string) {
//   try {
//     const user = await currentUser();
    
//     if (!user?.id) {
//       throw new Error("Unauthorized");
//     }
    
//     // Check if user is membership secretary or admin
//     const userData = await db.user.findUnique({
//       where: { id: user.id },
//       select: { role: true }
//     });
    
//     if (userData?.role !== 'MEMBERSHIP_SECRETARY' && userData?.role !== 'ADMIN') {
//       throw new Error("Unauthorized - Only membership secretary or admin can approve applications");
//     }
    
//     // Update application status
//     const application = await db.user.update({
//       where: { 
//         id: applicationId 
//       },
//       data: {
//         reviewedBy: user.id,
//         reviewedAt: new Date(),
//         reviewNotes: notes || null,
//         applicationStatus: "APPROVED"
//       },
//       select: {
//         id: true,
//         name: true,
//         fullname: true,
//         email: true,
//       }
//     });
    
//     // Get user details for notification
//     const applicantData = await db.user.findUnique({
//       where: { id: application.id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         fullname: true,
//         phone: true,
//         whatsapp: true,
//       },
//     });

//     if (!applicantData?.email) {
//       throw new Error("Applicant email not found");
//     }

//     // Send approval notification
//     await notifyApplicationApproved(
//       applicantData.email,
//       applicantData.fullname || applicantData.name || "User",
//       applicantData.phone,
//       applicantData.whatsapp,
//       notes
//     );
    
//     revalidatePath('/membership/applications');
//     return { success: true };
    
//   } catch (error) {
//     console.error("Error approving application:", error);
//     throw error;
//   }
// }

// /**
//  * Reject a membership application
//  */
// export async function rejectApplication(applicationId: string, notes?: string) {
//   try {
//     const user = await currentUser();
    
//     if (!user?.id) {
//       throw new Error("Unauthorized");
//     }
    
//     // Check if user is membership secretary or admin
//     const userData = await db.user.findUnique({
//       where: { id: user.id },
//       select: { role: true }
//     });
    
//     if (userData?.role !== 'MEMBERSHIP_SECRETARY' && userData?.role !== 'ADMIN') {
//       throw new Error("Unauthorized - Only membership secretary or admin can reject applications");
//     }
    
//     // Update application status
//     const application = await db.user.update({
//       where: { 
//         id: applicationId 
//       },
//       data: {
//         reviewedBy: user.id,
//         reviewedAt: new Date(),
//         reviewNotes: notes || null,
//         applicationStatus: "REJECTED"
//       },
//       select: {
//         id: true,
//         name: true,
//         fullname: true,
//         email: true,
//       }
//     });
    
//     // Get user details for notification
//     const applicantData = await db.user.findUnique({
//       where: { id: application.id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         fullname: true,
//         phone: true,
//         whatsapp: true,
//       },
//     });

//     if (!applicantData?.email) {
//       throw new Error("Applicant email not found");
//     }

//     // Send rejection notification
//     await notifyApplicationRejected(
//       applicantData.email,
//       applicantData.fullname || applicantData.name || "User",
//       applicantData.phone,
//       applicantData.whatsapp,
//       notes
//     );
    
//     revalidatePath('/membership/applications');
//     return { success: true };
    
//   } catch (error) {
//     console.error("Error rejecting application:", error);
//     throw error;
//   }
// } 