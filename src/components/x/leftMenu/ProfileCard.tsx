// components/ProfileCard.tsx
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

const ProfileCard = async () => {
  // Get the current session using next-auth
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // Fixed profile completion percentage for demonstration
  const profileCompletionPercentage = 75; // Set this to any desired value

  return (
    <div className="p-4 text-sm flex flex-col gap-2 ">
      
        <Link href={`/x/profile/${userId}`} className="font-bold text-lg reveal-less">
          
           إلى الملف ←
          
        </Link>
     
      <div className="flex flex-col gap-2">
        {/* Smaller, Sharp Progress Bar */}
        <div className="w-2/3 bg-gray-200 h-2">
          <div
            className="bg-black h-2"
            style={{ width: `${profileCompletionPercentage}%` }}
          ></div>
        </div>

        {/* Arabic Completion Text */}
        <span className="text-sm text-gray-600">
          {profileCompletionPercentage}% مكتمل
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
