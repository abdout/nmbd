// components/Post.tsx

import Image from "next/image";
import Comments from "./Comments";
import { Post as PostType, User } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
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

const Post = async ({ post }: { post: FeedPostType }) => {
  const session = await auth();
  const currentUserId = session?.user?.id;

  return (
    <>
    <Separator className='border-black border-1 -px-6'/>
    <div className="flex flex-col gap-4 ">
      {/* USER */}
      <div className="flex justify-between">
        <div className="flex  gap-4">
          <Image
            src={post.user.image || "/x/noAvatar.png"}
            width={40}
            height={40}
            alt="User Avatar"
            className="w-14 h-14 rounded-full"
          />
          <span className="font-medium ">
            {post.user.name && post.user.surname
              ? `${post.user.name} ${post.user.surname}`
              : post.user.username}
          </span>
          <span className="font-medium text-gray-400">
            3 س
          </span>
          

        </div>
        {currentUserId === post.user.id && <PostInfo postId={post.id} />}
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4 pr-[74px] -mt-11">
      <p>{post.desc}</p>
        {post.img && (
          <div className="w-full min-h-72 relative">
            <Image
              src={post.img}
              fill
              className="object-cover rounded-xl"
              alt="Post Image"
            />
          </div>
        )}
        {/* INTERACTION */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post._count.comments}
        />
      </Suspense>
        
      </div>
      

      {/* <Suspense fallback="Loading...">
        <Comments postId={post.id} />
      </Suspense> */}
    </div>
    </>
  );
};

export default Post;
