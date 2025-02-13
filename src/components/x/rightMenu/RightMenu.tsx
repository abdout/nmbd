import { User } from "@prisma/client";
import Tranding from "../layout/tranding";
import FollowFriend from "../layout/friend";
import FollowActivity from "../layout/activity";

const RightMenu = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tranding />
      <FollowFriend />
      <FollowActivity />
    </div>
  );
};

export default RightMenu;
