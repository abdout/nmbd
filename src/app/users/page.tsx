import { auth } from "@/auth";
import { db } from "@/lib/db";
// import { UserCard } from "@/components/user/user-card";

export const metadata = {
  title: "الأعضاء",
  description: "قائمة بجميع أعضاء المنصة",
};

export default async function UsersPage() {
  const session = await auth();
  // const currentUserId = session?.user?.id;
  
  // Fetch all users from the database
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      currentCountry: true,
      currentLocality: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return (
    <div className="container py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">الأعضاء</h1>
          <p className="text-muted-foreground">
            يمكنك استعراض جميع الأعضاء المسجلين في المنصة من هنا.
          </p>
        </div>
      </div>
      
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed mt-8 p-8 text-center">
          <h2 className="text-2xl font-semibold">لا يوجد أعضاء</h2>
          <p className="text-muted-foreground max-w-[500px] mt-2">
            لم يتم العثور على أي أعضاء مسجلين حتى الآن.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {/* {users.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              isCurrentUser={user.id === currentUserId}
            />
          ))} */}
        </div>
      )}
    </div>
  );
} 