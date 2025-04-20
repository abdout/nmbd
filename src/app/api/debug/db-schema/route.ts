import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * API route to inspect database schema
 * GET /api/debug/db-schema
 */
export async function GET() {
  console.log("====== DB SCHEMA INSPECTION API ======");
  
  try {
    // Get database metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      tables: {} as Record<string, any>,
      errors: [] as string[]
    };
    
    // Function to safely get table information
    async function inspectTable(tableName: string, modelName: string) {
      try {
        // Check if the model exists on db
        if (!(db as any)[modelName]) {
          return { error: `Model ${modelName} not found in db object` };
        }
        
        // Get count
        const count = await (db as any)[modelName].count();
        
        // Get sample record if available
        let sample = null;
        if (count > 0) {
          const records = await (db as any)[modelName].findMany({
            take: 1,
          });
          
          if (records && records.length > 0) {
            sample = records[0];
            
            // Don't expose sensitive fields
            const sensitiveFields = ['password', 'token', 'secret'];
            sensitiveFields.forEach(field => {
              if (sample[field]) {
                sample[field] = '[REDACTED]';
              }
            });
          }
        }
        
        return {
          count,
          fields: sample ? Object.keys(sample) : [],
          sample: sample ? JSON.stringify(sample) : null,
        };
      } catch (error) {
        console.error(`Error inspecting table ${tableName}:`, error);
        return { 
          error: error instanceof Error ? error.message : String(error),
          count: 'unknown'
        };
      }
    }
    
    // Common tables to inspect
    const tables = [
      { name: "users", model: "user" },
      { name: "posts", model: "post" },
      { name: "comments", model: "comment" },
      { name: "likes", model: "like" },
      // Add more tables as needed
    ];
    
    // Inspect each table
    for (const table of tables) {
      metadata.tables[table.name] = await inspectTable(table.name, table.model);
    }
    
    // Try to get database connection info
    try {
      const connectionInfo = {
        provider: (Prisma as any)._engineConfig?.activeProvider || 'unknown',
        connected: (db as any)._connected !== undefined ? (db as any)._connected : 'unknown'
      };
      metadata.connection = connectionInfo;
    } catch (error) {
      metadata.errors.push(`Failed to get connection info: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return NextResponse.json({
      success: true,
      message: "Database schema inspection completed",
      ...metadata
    });
  } catch (error) {
    console.error("Error in DB schema API:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to inspect database schema",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 