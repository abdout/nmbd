'use client';
import { switchLike } from "../actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useOptimistic, useState } from "react";

interface PostInteractionProps {
  postId: string;
  likes: string[];
  commentNumber: number;
}

const PostInteraction = ({
  postId,
  likes,
  commentNumber,
}: PostInteractionProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  });

  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state, value) => {
      return {
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );

  const likeAction = async () => {
    switchOptimisticLike("");
    try {
      await switchLike(postId);
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (err) {
      console.error(err);
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
          />
          {commentNumber}
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={likeAction}>
            <button type="submit">
              <Image
                src={optimisticLike.isLiked ? "/x/liked.png" : "/x/like.png"}
                width={18}
                height={18}
                alt="like"
                className="cursor-pointer mt-[6px]"
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
          />
        </div>
      </div>
    </div>
  );
};

export default PostInteraction;
