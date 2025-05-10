import { PrismaClient } from "@prisma/client";
import { neon, neonConfig } from '@neondatabase/serverless';

// This disables the https connection pooling so we can do our own
neonConfig.fetchConnectionCache = false;

// Get connection string from environment variables
const connectionString = process.env.DATABASE_URL as string;

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Create a client constructor that's safe for Edge and Node environments
const getPrismaClient = () => {
  // We're in Edge runtime if process.cwd() is not available
  const isEdgeRuntime = typeof process.cwd !== 'function';
  
  if (isEdgeRuntime) {
    // In Edge Runtime, use a simplified approach without file system checks
    try {
      return new PrismaClient();
    } catch (error) {
      console.error('Error initializing Prisma in Edge Runtime:', error);
      throw error;
    }
  } else {
    // In Node.js runtime, we can use the original implementation
    // It's safe to dynamically import Node.js modules here
    try {
      return new PrismaClient();
    } catch (error) {
      if (error instanceof Error && 
          error.message.includes('PrismaClientInitializationError') && 
          error.message.includes('could not locate the Query Engine')) {
        
        console.error('Prisma Engine not found in Node environment.');
        // We avoid using fs/path APIs here to keep this file Edge-compatible
        throw new Error(`Prisma engine not found. Error: ${error.message}. Please ensure the Prisma engine is properly installed and the binaryTargets in schema.prisma includes "rhel-openssl-3.0.x".`);
      }
      throw error;
    }
  }
};

// Use a safe global reference
declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = getPrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = getPrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

// For debugging Prisma issues - Edge compatible version
export function debugPrismaEngine() {
  try {
    const enginePath = (db as any)._engine?.binaryPath ?? "Unknown binary path";
    const engines = (db as any)._getActiveEngineInstances?.() ?? [];
    
    const debugInfo = {
      enginePath,
      enginesCount: engines.length,
      connectionStringStart: connectionString?.substring(0, 20) + "...",
      nodeEnv: process.env.NODE_ENV,
      isEdgeRuntime: typeof process.cwd !== 'function'
    };
    
    console.log("Prisma debug info:", debugInfo);
    return debugInfo;
  } catch (error) {
    console.error("Failed to debug Prisma engine:", error);
    return { error: String(error) };
  }
}
