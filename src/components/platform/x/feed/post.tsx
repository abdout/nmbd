// components/Post.tsx

import Image from "next/image";
// import Comments from "./comments";
import { Post as PostType, User } from "@prisma/client";
import PostInteraction from "./post-interaction";
import { Suspense } from "react";
import PostInfo from "./post-info";
import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";

 // Adjust the import path as necessary

type ExtendedUser = User & {
  surname?: string | null;
};

type FeedPostType = PostType & {
  user: ExtendedUser;
  likes: { userId: string }[];
  _count: { comments: number };
};

// Helper function to safely validate post data
const validatePostData = (post: any): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for required fields
  if (!post) {
    return { valid: false, issues: ['Post object is null or undefined'] };
  }
  
  if (!post.id) issues.push('Missing post ID');
  
  // Check for user object
  if (!post.user) {
    issues.push('Missing user object');
  } else {
    if (!post.user.id) issues.push('Missing user ID');
    if (!post.user.name) issues.push('Missing user name');
  }
  
  // Check for expected field types
  if (post.desc !== undefined && typeof post.desc !== 'string') {
    issues.push(`Invalid post description type: ${typeof post.desc}`);
  }
  
  if (post.img !== undefined && typeof post.img !== 'string') {
    issues.push(`Invalid post image type: ${typeof post.img}`);
  }
  
  // Check for likes array
  if (!Array.isArray(post.likes)) {
    issues.push('Likes field is not an array');
  }
  
  // Check for comments count
  if (!post._count || typeof post._count.comments !== 'number') {
    issues.push('Invalid comments count');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

const Post = async ({ post }: { post: FeedPostType }) => {
  console.log("====== POST RENDERING ======");
  console.log("Rendering post component for post ID:", post?.id || 'unknown');
  
  // Validate post data
  const validation = validatePostData(post);
  if (!validation.valid) {
    console.warn("Post data validation failed:", validation.issues);
  }
  
  try {
    // Debug all post properties
    console.log("Post object keys:", Object.keys(post));
    
    // Safe access to post fields with type checking
    const postDesc = post.desc && typeof post.desc === 'string' ? post.desc : '';
    const postImgUrl = post.img && typeof post.img === 'string' ? post.img : '';
    
    console.log("Post data details:", {
      id: post.id,
      desc: postDesc.substring(0, 30) + (postDesc.length > 30 ? "..." : ""),
      hasImage: !!postImgUrl,
      imageUrl: postImgUrl ? postImgUrl.substring(0, 50) + "..." : "none",
      userId: post.userId,
      userName: post.user?.name || 'unknown',
      userSurname: post.user?.surname || 'not set',
      likes: post.likes?.length || 0,
      comments: post._count?.comments || 0
    });
    
    // Get current user info
    const session = await auth();
    const currentUserId = session?.user?.id;
    console.log("Current user ID viewing post:", currentUserId);
    console.log("Is user's own post:", currentUserId === post.userId);
    
    // Check if user object is valid before attempting to render
    if (!post.user) {
      console.error("Missing user data in post:", post.id);
      return (
        <div className="p-4 border border-orange-200 rounded-md bg-orange-50">
          <p className="text-orange-600">This post has invalid user data and can't be displayed properly</p>
          <p className="text-sm text-gray-500">Post ID: {post.id}</p>
          <div className="mt-2 p-2 bg-white rounded text-xs">
            <pre>{JSON.stringify({
              id: post.id,
              userId: post.userId,
              desc: postDesc.substring(0, 30) + (postDesc.length > 30 ? "..." : ""),
              createdAt: post.createdAt ? post.createdAt.toString() : 'unknown'
            }, null, 2)}</pre>
          </div>
        </div>
      );
    }

    return (
      <>
      <Separator className='border-black border-1 -px-6'/>
      <div className="flex flex-col gap-4 ">
        {/* USER */}
        <div className="flex justify-between">
          <div className="flex  gap-4">
            <Image
              src={post.user?.image || "/x/noAvatar.png"}
              width={40}
              height={40}
              alt="User Avatar"
              className="w-14 h-14 rounded-full"
              onError={(e) => {
                console.log("Error loading user avatar image for post:", post.id);
                e.currentTarget.src = "/x/noAvatar.png";
              }}
            />
            <span className="font-medium ">
              {post.user?.name && post.user?.surname
                ? `${post.user.name} ${post.user.surname}`
                : post.user?.name || "Unknown User"}
            </span>
            <span className="font-medium text-gray-400">
              {post.createdAt ? new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "unknown time"}
            </span>
            

          </div>
          {currentUserId === post.user?.id && <PostInfo postId={post.id} />}
        </div>
        {/* DESC */}
        <div className="flex flex-col gap-4 pr-[74px] -mt-11">
        <p>{postDesc}</p>
          {postImgUrl && (
            <div className="w-full min-h-72 relative">
              <Image
                src={postImgUrl}
                fill
                className="object-cover rounded-xl"
                alt="Post Image"
                onError={(e) => {
                  console.log("Error loading post image for post:", post.id, "URL:", postImgUrl);
                  // Fall back to a placeholder if the image doesn't load
                  e.currentTarget.src = '/x/noAvatar.png';
                }}
              />
            </div>
          )}
          {/* INTERACTION */}
        <Suspense fallback={<div>Loading interactions...</div>}>
          <PostInteraction
            postId={post.id}
            likes={post.likes?.map((like) => like.userId) || []}
            commentNumber={post._count?.comments || 0}
          />
        </Suspense>
          
        </div>
        

        {/* <Suspense fallback="Loading...">
          <Comments postId={post.id} />
        </Suspense> */}
      </div>
      </>
    );
  } catch (error) {
    console.error("====== POST RENDER ERROR ======");
    console.error("Critical error rendering post:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // More detailed error UI
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-500 font-medium">Error rendering post</p>
        <p className="text-sm text-gray-600">Post ID: {post?.id || 'unknown'}</p>
        <p className="text-sm text-gray-600">Error: {error instanceof Error ? error.message : String(error)}</p>
        
        {post && (
          <div className="mt-3 p-2 bg-white rounded-md text-xs overflow-hidden">
            <p className="font-bold">Post Data Inspection:</p>
            <pre className="mt-1 overflow-auto max-h-40">
              {JSON.stringify({
                id: post.id,
                userId: post.userId,
                userExists: !!post.user,
                userKeys: post.user ? Object.keys(post.user) : null,
                hasDesc: 'desc' in post,
                descType: typeof post.desc,
                hasImg: 'img' in post,
                createdAt: post.createdAt ? post.createdAt.toString() : null
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }
};

export default Post;
