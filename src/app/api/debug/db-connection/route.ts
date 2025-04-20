import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

/**
 * API route to perform a direct database connection test
 * GET /api/debug/db-connection
 */
export async function GET() {
  console.log("====== DEEP DB CONNECTION TEST ======");
  
  // Store detailed diagnostics
  const diagnostics = {
    timestamp: new Date().toISOString(),
    dbObjectExists: !!db,
    envVariables: {
      databaseUrlExists: !!process.env.DATABASE_URL,
      directUrlExists: !!process.env.DIRECT_URL,
      databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('://')[0] : 'n/a'
    },
    connectionTests: [] as any[],
    tableQueries: [] as any[],
    verdict: "",
    suggestedFixes: [] as string[]
  };
  
  try {
    // Test 1: Check db object properties
    try {
      console.log("Testing db object properties");
      const dbProps = Object.keys(db);
      diagnostics.connectionTests.push({
        name: "DB Object Properties",
        success: dbProps.length > 0,
        details: `Found ${dbProps.length} properties`
      });
      
      // Check if the client exists
      const hasClient = !!(db as any)._client;
      diagnostics.connectionTests.push({
        name: "DB Client Object",
        success: hasClient,
        details: hasClient ? "Client exists" : "No client found"
      });
    } catch (err) {
      console.error("Error checking db properties:", err);
      diagnostics.connectionTests.push({
        name: "DB Object Properties",
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
    
    // Test 2: Try a simple query
    try {
      console.log("Testing simple query");
      const userCount = await db.user.count();
      diagnostics.tableQueries.push({
        name: "User Count Query",
        success: true,
        count: userCount,
        details: `Found ${userCount} users`
      });
    } catch (err) {
      console.error("Error querying user count:", err);
      diagnostics.tableQueries.push({
        name: "User Count Query",
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
      
      // Analyze error to suggest fixes
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes("connect")) {
        diagnostics.suggestedFixes.push("Check that your database server is running");
        diagnostics.suggestedFixes.push("Verify DATABASE_URL in your .env file");
      } else if (errorMsg.includes("does not exist")) {
        diagnostics.suggestedFixes.push("Run prisma migrate to create tables");
        diagnostics.suggestedFixes.push("Check if DATABASE_URL points to the correct database");
      }
    }
    
    // Test 3: Try a fresh connection
    try {
      console.log("Testing fresh connection");
      
      // Create a new client but don't log sensitive info
      const testClient = new PrismaClient();
      
      // Try a simple query
      const postCount = await testClient.post.count();
      await testClient.$disconnect();
      
      diagnostics.connectionTests.push({
        name: "Fresh Connection",
        success: true,
        details: `Successfully connected and counted ${postCount} posts`
      });
    } catch (err) {
      console.error("Error with fresh connection:", err);
      diagnostics.connectionTests.push({
        name: "Fresh Connection",
        success: false,
        error: err instanceof Error ? err.message : String(err)
      });
    }
    
    // Determine the verdict
    const allTestsSuccessful = [
      ...diagnostics.connectionTests,
      ...diagnostics.tableQueries
    ].every(test => test.success);
    
    if (allTestsSuccessful) {
      diagnostics.verdict = "Database connection is working correctly";
    } else {
      const failedConnectionTests = diagnostics.connectionTests.filter(t => !t.success).length;
      const failedTableQueries = diagnostics.tableQueries.filter(t => !t.success).length;
      
      if (failedConnectionTests > 0 && failedTableQueries > 0) {
        diagnostics.verdict = "Database connection is completely failing";
      } else if (failedTableQueries > 0) {
        diagnostics.verdict = "Database connection works but table queries are failing";
      } else {
        diagnostics.verdict = "Partial database connection issues";
      }
      
      // Add general suggestions
      if (diagnostics.suggestedFixes.length === 0) {
        diagnostics.suggestedFixes.push("Check your database connection string");
        diagnostics.suggestedFixes.push("Ensure database server is running");
        diagnostics.suggestedFixes.push("Verify that database schema matches your Prisma schema");
      }
    }
    
    return NextResponse.json({
      success: allTestsSuccessful,
      message: "Database connection test completed",
      ...diagnostics
    });
  } catch (error) {
    console.error("Error in DB connection test:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Failed to test database connection",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 