import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  currentCountry: string | null;
  currentLocality: string | null;
}

interface UserCardProps {
  user: User;
  isCurrentUser: boolean;
}

export function UserCard({ user, isCurrentUser }: UserCardProps) {
  // Extract initials from user name for avatar fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "??";

  // Format location if available
  const location = 
    user.currentLocality && user.currentCountry
      ? `${user.currentLocality}، ${user.currentCountry}`
      : user.currentLocality || user.currentCountry || null;

  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md", 
      isCurrentUser && "border-primary border-2")}>
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || ""} alt={user.name || "مستخدم"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 overflow-hidden">
          <Link 
            href={`/user/${user.id}`} 
            className="font-semibold leading-none hover:underline line-clamp-1"
          >
            {user.name || "مستخدم بدون اسم"}
          </Link>
          {isCurrentUser && (
            <Badge variant="outline" className="text-xs">أنت</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {user.bio}
          </p>
        )}
      </CardContent>
      {location && (
        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 ml-2 rtl:ml-1 rtl:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 