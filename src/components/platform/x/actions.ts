// serverActions.ts

"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";


export const switchFollow = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingFollow = await db.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await db.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await db.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await db.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await db.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const switchBlock = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingBlock = await db.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await db.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await db.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingFollowRequest = await db.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await db.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await db.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingFollowRequest = await db.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await db.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (payload: {
  name?: string;
  nickname?: string;
  username?: string;
  description?: string;
  bio?: string;
  onboarded?: boolean;

  // attachment
  image?: string;
  cover?: string;
  cv?: string;
  additionalFile?: string;
  
  // Contact Information
  phone?: string;
  whatsapp?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  telegram?: string;
  instagram?: string;
  tiktok?: string;
  
  // Personal Information
  birthDate?: Date;
  birthCountry?: string;
  birthState?: string;
  birthLocality?: string;
  birthAdminUnit?: string;
  birthNeighborhood?: string;

  // Current Location
  currentCountry?: string;
  currentState?: string;
  currentLocality?: string;
  currentAdminUnit?: string;
  currentNeighborhood?: string;

  // Original Location
  originalCountry?: string;
  originalState?: string;
  originalLocality?: string;
  originalAdminUnit?: string;
  originalNeighborhood?: string;

  nationalityId?: string;
  maritalStatus?: string;
  gender?: string;
  religion?: string;
  
  // Education & Work
  educationLevel?: string;
  institution?: string;
  yearOfCompletion?: number;
  currentOccupation?: string;
  employmentSector?: string;
  workplaceAddress?: string;
  
  // Student Details
  studentInstitution?: string;
  studentFaculty?: string;
  studentYear?: number;

  // Activities & Skills
  politicalParty?: string;
  politicalMembership?: string;
  socialActivityType?: string;
  socialDescription?: string;
  skills?: string[];
  languageSkills?: string[];
  
  // Emergency Contacts
  emergencyName1?: string;
  emergencyRelation1?: string;
  emergencyPhone1?: string;
  emergencyName2?: string;
  emergencyRelation2?: string;
  emergencyPhone2?: string;

  // Other
  referralSource?: string;
  acquaintanceName?: string;
  donationAmount?: number;
  donationDate?: Date;
  oathAcknowledged?: boolean;
}) => {
  const ProfileSchema = z.object({
    name: z.string().max(60).optional(),
    nickname: z.string().max(60).optional(),
    username: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    bio: z.string().max(500).optional(),
    onboarded: z.boolean().optional(),

    // attachment
    image: z.string().max(255).optional(),
    cover: z.string().max(255).optional(),
    cv: z.string().max(255).optional(),
    additionalFile: z.string().max(255).optional(),

    // Contact Information
    phone: z.string().max(20).optional(),
    whatsapp: z.string().max(20).optional(),
    twitter: z.string().max(100).optional(),
    facebook: z.string().max(100).optional(),
    linkedin: z.string().max(100).optional(),
    telegram: z.string().max(100).optional(),
    instagram: z.string().max(100).optional(),
    tiktok: z.string().max(100).optional(),

    // Personal Information
    birthDate: z.date().optional(),
    birthCountry: z.string().max(100).optional(),
    birthState: z.string().max(100).optional(),
    birthLocality: z.string().max(100).optional(),
    birthAdminUnit: z.string().max(100).optional(),
    birthNeighborhood: z.string().max(100).optional(),

    // Current Location
    currentCountry: z.string().max(100).optional(),
    currentState: z.string().max(100).optional(),
    currentLocality: z.string().max(100).optional(),
    currentAdminUnit: z.string().max(100).optional(),
    currentNeighborhood: z.string().max(100).optional(),

    // Original Location
    originalCountry: z.string().max(100).optional(),
    originalState: z.string().max(100).optional(),
    originalLocality: z.string().max(100).optional(),
    originalAdminUnit: z.string().max(100).optional(),
    originalNeighborhood: z.string().max(100).optional(),

    nationalityId: z.string().optional(),
    maritalStatus: z.string().max(50).optional(),
    gender: z.string().max(50).optional(),
    religion: z.string().max(50).optional(),

    // Education & Work
    educationLevel: z.string().max(100).optional(),
    institution: z.string().max(100).optional(),
    yearOfCompletion: z.number().int().positive().optional(),
    currentOccupation: z.string().max(100).optional(),
    employmentSector: z.string().max(100).optional(),
    workplaceAddress: z.string().max(200).optional(),

    // Student Details
    studentInstitution: z.string().max(100).optional(),
    studentFaculty: z.string().max(100).optional(),
    studentYear: z.number().int().positive().optional(),

    // Activities & Skills
    politicalParty: z.string().max(100).optional(),
    politicalMembership: z.string().max(100).optional(),
    socialActivityType: z.string().max(100).optional(),
    socialDescription: z.string().max(255).optional(),
    skills: z.array(z.string()).optional(),
    languageSkills: z.array(z.string()).optional(),

    // Emergency Contacts
    emergencyName1: z.string().max(100).optional(),
    emergencyRelation1: z.string().max(50).optional(),
    emergencyPhone1: z.string().max(20).optional(),
    emergencyName2: z.string().max(100).optional(),
    emergencyRelation2: z.string().max(50).optional(),
    emergencyPhone2: z.string().max(20).optional(),

    // Other
    referralSource: z.string().max(100).optional(),
    acquaintanceName: z.string().max(100).optional(),
    donationAmount: z.number().positive().optional(),
    donationDate: z.date().optional(),
    oathAcknowledged: z.boolean().optional(),
  });

  const validatedFields = ProfileSchema.safeParse(payload);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const user = await currentUser();

  if (!user || !user.id) {
    return { success: false, error: true };
  }

  try {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingLike = await db.like.findFirst({
      where: {
        postId,
        userId: currentUserId,
      },
    });

    if (existingLike) {
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await db.like.create({
        data: {
          postId,
          userId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addComment = async (postId: string, desc: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const createdComment = await db.comment.create({
      data: {
        desc,
        userId: currentUserId,
        postId,
      },
      include: {
        user: true,
      },
    });

    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  console.log("debug posting: Server action addPost started");
  console.log("debug posting: Received image URL in addPost:", img);
  console.log("debug posting: FormData keys:", [...formData.keys()]);
  
  const desc = formData.get("desc") as string;
  console.log("debug posting: Description from form:", desc, "length:", desc?.length);

  const Desc = z.string().min(1).max(255);
  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log("debug posting: Validation failed:", validatedDesc.error);
    return;
  }
  console.log("debug posting: Description validation successful");

  try {
    const user = await currentUser();
    console.log("debug posting: Current user:", user?.id);

    if (!user || !user.id) {
      console.log("debug posting: ERROR - User not authenticated!");
      throw new Error("User is not authenticated!");
    }

    const currentUserId = user.id;
    console.log("debug posting: Creating post for user:", currentUserId);

    try {
      const newPost = await db.post.create({
        data: {
          desc: validatedDesc.data,
          userId: currentUserId,
          img,
        },
      });
      console.log("debug posting: Post created successfully with ID:", newPost.id);

      // Revalidate multiple paths to ensure feed updates
      console.log("debug posting: Revalidating paths");
      revalidatePath("/");
      revalidatePath("/platform/x");
      revalidatePath(`/platform/x/profile/${currentUserId}`);
      
      return { success: true, postId: newPost.id };
    } catch (err) {
      console.log("debug posting: Database error when creating post:", err);
      throw err;
    }
  } catch (err) {
    console.log("debug posting: Error in addPost server action:", err);
    throw err;
  }
};


export const deletePost = async (postId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    await db.post.delete({
      where: {
        id: postId,
        userId: currentUserId,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};
