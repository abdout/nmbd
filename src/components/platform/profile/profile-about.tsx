interface ProfileAboutProps {
  user: {
    bio: string | null;
    currentCountry: string | null;
    currentLocality: string | null;
    currentNeighborhood: string | null;
    email: string | null;
    whatsapp: string | null;
    fullname: string | null;
  };
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCountryLabel, getLocalityLabel, getNeighborhoodLabel } from '@/utils/getArabicLabel';

export type UserProfileData = ProfileAboutProps['user'];

const PersonalInfo = ({ user }: { user: UserProfileData }) => {
  return (
    <Card className="bg-background">
      <CardHeader className="border-b bg-background">
        <CardTitle>معلومات</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 bg-background">
        <div className="space-y-4">
        {user.fullname && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">الاسم</p>
              <p>{user.fullname}</p>
            </div>
          )}
          {user.currentCountry && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">السكن</p>
              <div className="flex gap-2">
                <p>{getCountryLabel(user.currentCountry)}</p>
                <p>{getLocalityLabel(user.currentLocality ?? undefined)}</p>
                
              </div>
            </div>
          )}
          
          {!user.currentCountry && !user.currentLocality && !user.currentNeighborhood && (
            <p className="text-center text-gray-500">لا توجد بيانات للعنوان</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ContactInfo = ({ user }: { user: UserProfileData }) => {
  return (
    <Card className="bg-background">
      <CardHeader className="border-b bg-background">
        <CardTitle>الاتصال</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-background">
        <div className="space-y-4">
          {user.email && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p>{user.email}</p>
            </div>
          )}
          {user.whatsapp && (
            <div className="space-y-1">
              <p className="text-sm text-gray-500">واتساب</p>
              <p>{user.whatsapp}</p>
            </div>
          )}
          {!user.email && !user.whatsapp && (
            <p className="text-center text-gray-500">لا توجد معلومات اتصال</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// const BioSection = ({ bio }: { bio: string | null }) => {
//   return (
//     <Card>
//       <CardHeader className="border-b">
//         <CardTitle>نبذة شخصية</CardTitle>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <p className="text-gray-700">
//           {bio || "لا توجد معلومات متاحة"}
//         </p>
//       </CardContent>
//     </Card>
//   );
// };

export function ProfileAboutContainer({ user }: ProfileAboutProps) {
  return (
    <div className="space-y-4 bg-background">
      {/* <BioSection bio={user.bio} /> */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background">
        <div className="md:col-span-2 bg-background">
          <PersonalInfo user={user} />
        </div>
        <div className="md:col-span-1 bg-background">
          <ContactInfo user={user} />
        </div>
      </div>
    </div>
  );
}

// For backward compatibility, keep the original component name
export function ProfileAbout(props: ProfileAboutProps) {
  return <ProfileAboutContainer {...props} />;
} 