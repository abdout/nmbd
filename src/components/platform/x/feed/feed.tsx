"use server";

import { auth } from "@/auth";
import Post from "./post";
import { db } from "@/lib/db";

// Simple server component to load posts
const Feed = async ({ userId }: { userId?: string }) => {
  console.log("====== FEED DEBUG ======");
  console.log("Feed component executing at", new Date().toISOString());
  console.log("Feed params - userId:", userId);
  
  // Get current user
  const session = await auth();
  const currentUserId = session?.user?.id;
  const isAuthenticated = !!currentUserId;
  
  console.log("Current user authenticated:", isAuthenticated);
  console.log("Current user ID:", currentUserId);
  
  // Check if we have a valid database connection
  console.log("Database connection check:", !!db ? "DB object exists" : "DB object missing");
  try {
    console.log("Database client connection status:", (db as any)._connected || "Unknown");
  } catch (err) {
    console.log("Unable to check db connection status:", err);
  }
  
  try {
    // First query a raw post to inspect its exact structure
    console.log("====== DATABASE INSPECTION ======");
    console.log("Attempting direct database inspection of post structure...");
    const rawPost = await db.post.findFirst({
      include: {
        user: true
      }
    });
    
    if (rawPost) {
      console.log("✅ DATABASE INSPECTION: Raw post example found with ID:", rawPost.id);
      console.log("DATABASE DETAILS: Raw post fields:", Object.keys(rawPost));
      console.log("DATABASE DETAILS: Raw post user fields:", rawPost.user ? Object.keys(rawPost.user) : "No user");
      console.log("DATABASE SAMPLE: Raw post sample:", {
        id: rawPost.id,
        userId: rawPost.userId,
        desc: typeof rawPost.desc === 'string' ? (rawPost.desc.substring(0, 30) + "...") : "[no desc]",
        img: rawPost.img ? "Has image" : "No image",
        createdAt: rawPost.createdAt,
        user: rawPost.user ? {
          id: rawPost.user.id,
          name: rawPost.user.name
        } : "No user"
      });
    } else {
      console.warn("❌ DATABASE INSPECTION: No posts found in database during inspection");
      
      // Check if we can query any table to verify DB connection
      try {
        console.log("Attempting to query users table to verify connection...");
        const userCount = await db.user.count();
        console.log(`User count in database: ${userCount}`);
      } catch (dbErr) {
        console.error("Failed to query users table:", dbErr);
      }
    }
    
    // Fetch posts without any complex filtering
    console.log("====== POSTS QUERY ======");
    console.log("Attempting to fetch posts from database...");
    
    // If userId is provided, filter by that, otherwise get all posts
    const queryOptions = userId ? {
      where: {
        userId: userId
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    } : {
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    };
    
    console.log("Using query options:", JSON.stringify({
      ...queryOptions,
      where: userId ? { userId } : undefined
    }, null, 2));
    
    const posts = await db.post.findMany(queryOptions);
    
    console.log(`✅ POSTS QUERY: Found ${posts.length} posts`);
    
    // Log detailed info about each post
    posts.forEach((post, index) => {
      console.log(`Post ${index + 1} details:`, {
        id: post.id,
        hasUser: !!post.user,
        userId: post?.user?.id,
        userName: post?.user?.name,
        // Check for desc field
        desc: post['desc'] ? (typeof post['desc'] === 'string' ? post['desc'].substring(0, 30) + "..." : "[invalid desc]") : "[missing desc]",
        createdAt: post.createdAt,
        likes: post.likes.length
      });
    });
    
    // MODIFICATION: Only filter out posts that have no user at all
    // previously we were checking for both post.user and typeof post.user !== 'undefined'
    // which might have been too strict
    const validPosts = posts.filter(post => !!post.user);
    
    console.log(`Feed filtered - ${validPosts.length} valid posts remaining`);
    if (posts.length !== validPosts.length) {
      console.warn(`Removed ${posts.length - validPosts.length} posts due to missing user data`);
      
      // Log details of filtered out posts
      posts
        .filter(post => !post.user)
        .forEach((post, index) => {
          console.warn(`Filtered out post ${index + 1}:`, {
            id: post.id,
            user: post.user,
            keys: Object.keys(post)
          });
        });
    }
    
    // Render posts or show appropriate message
    if (validPosts.length === 0) {
      console.log("====== RENDERING ======");
      console.log("❌ No valid posts to display after filtering");
      
      // Check if we have posts at all before filtering
      if (posts.length > 0) {
        console.log("EMERGENCY OVERRIDE: Posts exist but all were filtered out. Trying to render all posts anyway.");
        // Try to render all posts as a fallback
        return (
          <div className="p-4 flex flex-col gap-8">
            <div className="text-sm text-red-600 mb-4">
              Found {posts.length} posts (validation bypassed - debug mode)
            </div>
            
            {/* Debug display to help understand what's wrong with the data */}
            <div className="mb-6 p-3 border border-orange-200 bg-orange-50 rounded text-sm">
              <h3 className="font-bold mb-2 text-orange-800">Data Inspection</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded">
                  <h4 className="font-bold">Database Connectivity</h4>
                  <p>DB object exists: {String(!!db)}</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <h4 className="font-bold">Posts Retrieved</h4>
                  <p>Total posts: {posts.length}</p>
                  <p>Posts with valid user: {posts.filter(post => !!post.user).length}</p>
                </div>
              </div>
              
              <div className="mt-3 bg-white p-2 rounded">
                <h4 className="font-bold">Post Structure Sample</h4>
                {posts.length > 0 ? (
                  <pre className="text-xs overflow-auto max-h-32">
                    {JSON.stringify({
                      id: posts[0].id,
                      userId: posts[0].userId,
                      userObject: posts[0].user ? "exists" : "missing",
                      userKeys: posts[0].user ? Object.keys(posts[0].user) : "N/A",
                      fields: Object.keys(posts[0]),
                    }, null, 2)}
                  </pre>
                ) : (
                  <p>No posts available to inspect</p>
                )}
              </div>
            </div>
            
            {posts.map((post) => {
              console.log(`Rendering unfiltered post ${post.id}`);
              try {
                return <Post key={post.id} post={post} />;
              } catch (err) {
                console.error(`Error rendering unfiltered post ${post.id}:`, err);
                return (
                  <div key={post.id} className="p-3 border border-red-300 rounded bg-red-50">
                    <p className="text-red-500">Error rendering post</p>
                    <p className="text-xs text-gray-500">Post ID: {post.id}</p>
                    <p className="text-xs text-gray-500">Error: {err instanceof Error ? err.message : String(err)}</p>
                    <div className="mt-2 text-xs">
                      <p className="font-bold">Post data:</p>
                      <pre className="overflow-auto max-h-32 bg-gray-50 p-1 rounded">
                        {JSON.stringify({
                          id: post.id,
                          userId: post.userId,
                          user: post.user ? Object.keys(post.user) : null,
                          hasDesc: 'desc' in post,
                          hasCreatedAt: 'createdAt' in post
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        );
      }
      
      // No posts available - show detailed explanation
      const diagnosticInfo = {
        authenticated: isAuthenticated,
        userIdFilter: !!userId,
        filterMatchesCurrentUser: userId === currentUserId,
        postsCount: posts.length,
        validPostsCount: validPosts.length,
      };
      
      return (
        <div className="p-4">
          <div className="flex flex-col items-center text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No posts available</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              {userId 
                ? "There are no posts from this user yet." 
                : "There are no posts in the feed yet."}
            </p>
          </div>
          
          <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded text-sm">
            <h3 className="font-bold mb-2">Diagnostic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <div className="bg-white p-2 rounded">
                <p className="text-xs font-medium">Login Status:</p>
                <p className="text-sm">{isAuthenticated ? 'Logged in' : 'Not logged in'}</p>
                {isAuthenticated && (
                  <p className="text-xs text-gray-500 mt-1">User ID: {currentUserId}</p>
                )}
              </div>
              
              <div className="bg-white p-2 rounded">
                <p className="text-xs font-medium">Filter Status:</p>
                <p className="text-sm">
                  {userId 
                    ? `Filtered by user: ${userId}` 
                    : 'No user filter (showing all posts)'}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded mb-3">
              <p className="text-xs font-medium mb-1">Troubleshooting Tips:</p>
              <ul className="text-xs list-disc pl-4 space-y-1">
                <li>If you're looking for your own posts, make sure you're logged in</li>
                <li>Try viewing all posts by removing any user filter</li>
                <li>If you just created a post, try refreshing the feed</li>
                <li>Check database connection and post count in the debug section</li>
              </ul>
            </div>
            
            <p className="text-xs text-gray-500">
              Database query completed at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      );
    }
    
    console.log("====== RENDERING ======");
    console.log("✅ Rendering feed with valid posts...");
    return (
      <div className="p-4 flex flex-col gap-8">
        <div className="text-sm text-gray-600 mb-4 flex justify-between items-center">
          <span>Found {validPosts.length} posts</span>
          {userId && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Filtered by user: {userId === currentUserId ? 'You' : userId}
            </span>
          )}
        </div>
        
        {validPosts.map((post) => {
          console.log(`Rendering post ${post.id} by user ${post.user?.name || 'unknown'}`);
          try {
            return <Post key={post.id} post={post} />;
          } catch (err) {
            console.error(`Error rendering post ${post.id}:`, err);
            return (
              <div key={post.id} className="p-3 border border-red-300 rounded bg-red-50">
                <p className="text-red-500">Error rendering post</p>
                <p className="text-xs text-gray-500">Post ID: {post.id}</p>
              </div>
            );
          }
        })}
      </div>
    );
  } catch (error) {
    console.error("====== ERROR IN FEED ======");
    console.error("Error in Feed component:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Try to provide more helpful error information
    let errorMessage = "Something went wrong loading the feed.";
    
    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        errorMessage = "Unable to connect to the database. Please check your database connection.";
      } else if (error.message.includes("table") || error.message.includes("column")) {
        errorMessage = "Database schema issue detected. Schema might be outdated or incorrect.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Database query timed out. The server might be overloaded.";
      }
    }
    
    return (
      <div className="p-4 text-red-500">
        <div className="p-6 border border-red-200 rounded-md bg-red-50 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">{errorMessage}</h3>
          <p className="text-sm text-gray-600 mb-4">
            There was a problem loading posts from the database. This might be a temporary issue.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Technical details: {error instanceof Error ? error.message : String(error)}
          </p>
          <button 
            className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
          >
            Try refreshing
          </button>
        </div>
      </div>
    );
  }
};

export default Feed;
