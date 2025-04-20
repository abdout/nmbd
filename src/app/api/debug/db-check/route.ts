import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

/**
 * API route to check database connectivity
 * GET /api/debug/db-check
 */
export async function GET() {
  try {
    // Check authentication (optional, remove if causing issues)
    const session = await auth();
    const isAuthenticated = !!session?.user;
    const userId = session?.user?.id;
    
    console.log("====== DB CHECK API ======");
    console.log("Authentication status:", isAuthenticated ? "Authenticated" : "Not authenticated");
    console.log("User ID:", userId || "Not logged in");
    
    // Basic DB connectivity test
    let dbStatus = "unknown";
    try {
      // Check if db object exists
      dbStatus = !!db ? "DB object exists" : "DB object missing";
      
      // Try to access a property that might indicate connection
      if ((db as any)._connected !== undefined) {
        dbStatus = (db as any)._connected ? "Connected" : "Not connected";
      }
    } catch (err) {
      console.error("Error checking DB connection status:", err);
      dbStatus = "Error checking connection status";
    }
    
    // Get database schema and counts
    const databaseInfo = {
      status: dbStatus,
      counts: {} as Record<string, number>,
      tablesFound: [] as string[],
      userPosts: userId ? 0 : null,
      error: null as string | null
    };
    
    try {
      // Try to get counts from major tables
      const userCount = await db.user.count();
      const postCount = await db.post.count();
      
      databaseInfo.counts.users = userCount;
      databaseInfo.counts.posts = postCount;
      databaseInfo.tablesFound = Object.keys(databaseInfo.counts);
      
      // If we have a user ID, count their posts
      if (userId) {
        const userPostCount = await db.post.count({
          where: {
            userId: userId
          }
        });
        databaseInfo.userPosts = userPostCount;
        console.log(`Found ${userPostCount} posts for user ID ${userId}`);
      }
      
      // Try other tables if they exist
      try { databaseInfo.counts.comments = await db.comment.count(); } catch {}
      try { databaseInfo.counts.likes = await db.like.count(); } catch {}
      
      // Check database connection info
      let connectionInfo = {};
      try {
        const dbClient = (db as any)._client;
        connectionInfo = {
          provider: dbClient?.provider || 'unknown',
          databaseUrl: process.env.DATABASE_URL ? '(URL exists but redacted)' : '(missing)',
          directUrl: process.env.DIRECT_URL ? '(URL exists but redacted)' : '(missing)'
        };
      } catch (e) {
        console.error("Error checking DB client:", e);
      }
      
      databaseInfo.connectionInfo = connectionInfo;
      
      console.log("DB check results:", databaseInfo);
    } catch (dbError) {
      console.error("Error querying database:", dbError);
      databaseInfo.error = dbError instanceof Error ? dbError.message : String(dbError);
    }
    
    // Return information about the database
    return NextResponse.json({
      success: true,
      message: "Database check completed",
      timestamp: new Date().toISOString(),
      isAuthenticated,
      userId,
      database: databaseInfo
    });
  } catch (error) {
    console.error("Error in DB check API:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check database",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 