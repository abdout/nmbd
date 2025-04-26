// import { PrismaClient } from "@prisma/client";

// declare global {
//   let prisma: PrismaClient | undefined;
// }

// // Add Article model to PrismaClient type
// type PrismaClientWithArticle = PrismaClient & {
//   article: any;
// };

// // Explicitly type global to allow prisma property
// const globalForPrisma = global as { prisma?: PrismaClientWithArticle }

// export const db = (globalForPrisma.prisma || new PrismaClient()) as PrismaClientWithArticle;

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

import { PrismaClient } from "@prisma/client";

declare global {
  let prisma: PrismaClient | undefined;
}

// Explicitly type global to allow prisma property
const globalForPrisma = global as { prisma?: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;