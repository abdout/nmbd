'use client';
import { switchLike } from "../actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";

interface PostInteractionProps {
  postId: string;
  likes: string[];
  commentNumber: number;
}

const PostInteraction = ({
  postId,
  likes = [],
  commentNumber = 0,
}: PostInteractionProps) => {
  try {
    console.log("debug posting: PostInteraction component rendered for post:", postId);
    console.log("debug posting: Initial likes count:", likes?.length || 0);
    
    const { data: session } = useSession();
    const userId = session?.user?.id;
    
    useEffect(() => {
      console.log("debug posting: PostInteraction session loaded - user ID:", userId);
    }, [userId]);
  
    const safetyLikes = Array.isArray(likes) ? likes : [];
  
    const [likeState, setLikeState] = useState({
      likeCount: safetyLikes.length,
      isLiked: userId ? safetyLikes.includes(userId) : false,
    });
    
    useEffect(() => {
      console.log("debug posting: Initial like state:", {
        postId,
        userId,
        likeCount: likeState.likeCount,
        isLiked: likeState.isLiked,
      });
    }, []);
  
    const [optimisticLike, switchOptimisticLike] = useOptimistic(
      likeState,
      (state, value) => {
        const newState = {
          likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
          isLiked: !state.isLiked,
        };
        console.log("debug posting: Optimistic like state update:", newState);
        return newState;
      }
    );
  
    const likeAction = async () => {
      if (!userId) {
        console.warn("debug posting: Like action attempted without user login");
        return;
      }
      
      console.log("debug posting: Like action started for post:", postId);
      switchOptimisticLike("");
      try {
        console.log("debug posting: Calling server action switchLike");
        await switchLike(postId);
        const newState = {
          likeCount: likeState.isLiked ? likeState.likeCount - 1 : likeState.likeCount + 1,
          isLiked: !likeState.isLiked,
        };
        console.log("debug posting: Like action successful, new state:", newState);
        setLikeState(newState);
      } catch (err) {
        console.error("debug posting: Error in like action:", err);
        setLikeState({
          likeCount: safetyLikes.length,
          isLiked: userId ? safetyLikes.includes(userId) : false,
        });
      }
    };
  
    return (
      <div className="flex my-2 ">
        <div className="w-5/6 flex justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/x/comment.png"
              width={20}
              height={20}
              alt="comment"
              className="cursor-pointer"
              loading="lazy"
              onError={(e) => {
                console.error("debug posting: Failed to load comment icon");
                e.currentTarget.style.display = 'none';
              }}
            />
            {commentNumber}
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/x/retweet.png"
              width={20}
              height={20}
              alt="retweet"
              className="cursor-pointer"
              loading="lazy"
              onError={(e) => {
                console.error("debug posting: Failed to load retweet icon");
                e.currentTarget.style.display = 'none';
              }}
            />
            {commentNumber}
          </div>
          <div className="flex items-center gap-2">
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log("debug posting: Like form submitted for post:", postId);
              likeAction();
            }}>
              <button type="submit">
                <Image
                  src={optimisticLike.isLiked ? "/x/liked.png" : "/x/like.png"}
                  width={18}
                  height={18}
                  alt="like"
                  className="cursor-pointer mt-[6px]"
                  loading="lazy"
                  onError={(e) => {
                    console.error("debug posting: Failed to load like icon");
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </button>
            </form>
            {optimisticLike.likeCount}
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/x/share.png"
              width={20}
              height={20}
              alt="share"
              className="cursor-pointer"
              loading="lazy"
              onError={(e) => {
                console.error("debug posting: Failed to load share icon");
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("debug posting: Critical error in PostInteraction:", error);
    return (
      <div className="flex my-2 text-xs text-gray-400">
        Post interaction controls unavailable
      </div>
    );
  }
};

export default PostInteraction;
