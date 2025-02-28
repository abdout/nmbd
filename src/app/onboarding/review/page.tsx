'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/components/auth/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { fetchUserForReview, completeOnboarding, type UserReviewData } from './action';
import Image from 'next/image';

// Helper function to convert PDF URL to preview URL
const getPdfPreviewUrl = (url: string) => {
  if (!url.includes('cloudinary.com')) return url;

  // Always use /upload/ path and ensure PDF extension is removed
  url = url.replace('/raw/upload/', '/upload/').replace('.pdf', '');
  
  // Extract the base URL and file path
  const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);
  const filePath = url.substring(url.indexOf('/upload/') + 8);
  
  // Generate preview URL with transformation
  return `${baseUrl}q_auto,f_jpg,pg_1/${filePath}`;
};

export default function ReviewPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchUserForReview();

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setUserData(result.data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding();

      if (result.success) {
        setShowDialog(true);
      } else {
        setError(result.error || "حدث خطأ أثناء إكمال عملية التسجيل");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError("حدث خطأ أثناء إكمال عملية التسجيل");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">حدث خطأ</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/onboarding')}>
          العودة إلى التسجيل
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">


      <h1 className="font-heading text-5xl font-bold mb-3">{userData?.name || 'غير محدد'}</h1>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>{userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString('ar-EG', { year: 'numeric' }) : 'غير محدد'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>{`${userData?.currentCountry || ''} ${userData?.currentLocality ? `- ${userData.currentLocality}` : ''}`}</span>
        </div>
        {userData?.phone && (
          <div className="flex items-center gap-2">
            <span>•</span>
            <span dir="ltr">{userData.phone}</span>
          </div>
        )}
        {userData?.whatsapp && (
          <div className="flex items-center gap-2">
            <span>•</span>
            <span dir="ltr">{userData.whatsapp}</span>
          </div>
        )}
      </div>
      
        <div className="flex flex-row justify-center gap-16">
          <div className="relative flex items-center justify-center w-40 h-40 overflow-hidden border border-neutral-500 rounded-lg">
            {userData?.image ? (
              <Image
                src={userData.image}
                alt="الصورة الشخصية"
                width={160}
                height={160}
                className="absolute inset-0 w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                الصورة الشخصية
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center w-40 h-40 overflow-hidden border border-neutral-500 rounded-lg">
            {userData?.cv ? (
              <div className="relative w-full h-full">
                <Image
                  src={getPdfPreviewUrl(userData.cv)}
                  alt="السيرة الذاتية"
                  width={160}
                  height={160}
                  className="absolute inset-0 w-full h-full object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                  PDF
                </div>
              </div>
            ) : (
              <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                السيرة الذاتية
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center w-40 h-40 overflow-hidden border border-neutral-500 rounded-lg">
            {userData?.portfolio ? (
              <div className="relative w-full h-full">
                <Image
                  src={getPdfPreviewUrl(userData.portfolio)}
                  alt="البورتفوليو"
                  width={160}
                  height={160}
                  className="absolute inset-0 w-full h-full object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                  PDF
                </div>
              </div>
            ) : (
              <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                البورتفوليو
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center w-40 h-40 overflow-hidden border border-neutral-500 rounded-lg">
            {userData?.additionalFile ? (
              <div className="relative w-full h-full">
                <Image
                  src={getPdfPreviewUrl(userData.additionalFile)}
                  alt="ملف إضافي"
                  width={160}
                  height={160}
                  className="absolute inset-0 w-full h-full object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-1">
                  PDF
                </div>
              </div>
            ) : (
              <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
                ملف إضافي
              </span>
            )}
          </div>
        </div>
      


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p dir="ltr">{userData?.email || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p dir="ltr">{userData?.phone || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">واتساب</p>
                    <p dir="ltr">{userData?.whatsapp || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p>{userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString('ar') : 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">الجنس</p>
                    <p>{userData?.gender || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">الحالة الاجتماعية</p>
                    <p>{userData?.maritalStatus || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">رقم الهوية</p>
                    <p dir="ltr">{userData?.nationalityId || 'غير محدد'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>المؤهلات العلمية</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {userData?.phdInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-lg">
                        دكتوراه {userData.phdMajor} - {userData.phdInstitution}, {userData.phdCompletionYear}
                      </p>
                    </div>
                  )}
                  {userData?.masterInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-lg">
                        ماجستير {userData.masterMajor} - {userData.masterInstitution}, {userData.masterCompletionYear}
                      </p>
                    </div>
                  )}
                  {userData?.bachelorInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-lg">
                        بكالريوس {userData.bachelorMajor} - {userData.bachelorInstitution}, {userData.bachelorCompletionYear}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>الخبرة المهنية</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">المهنة الحالية</p>
                    <p>{userData?.currentOccupation || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">قطاع العمل</p>
                    <p>{userData?.employmentSector || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">الشركة</p>
                    <p>{userData?.companyName || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">عنوان العمل</p>
                    <p>{userData?.workplaceAddress || 'غير محدد'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Info Column */}
          <div className="space-y-8">
            {/* Current Address Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>العنوان الحالي</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">البلد</p>
                    <p>{userData?.currentCountry || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">الولاية</p>
                    <p>{userData?.currentState || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">المحلية</p>
                    <p>{userData?.currentLocality || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">الوحدة الإدارية</p>
                    <p>{userData?.currentAdminUnit || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">الحي</p>
                    <p>{userData?.currentNeighborhood || 'غير محدد'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {userData?.twitter && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500">X</span>
                      </div>
                      <span dir="ltr" className="flex-1 text-sm">{userData.twitter}</span>
                    </div>
                  )}
                  {userData?.facebook && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500">f</span>
                      </div>
                      <span dir="ltr" className="flex-1 text-sm">{userData.facebook}</span>
                    </div>
                  )}
                  {userData?.linkedin && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500">L</span>
                      </div>
                      <span dir="ltr" className="flex-1 text-sm">{userData.linkedin}</span>
                    </div>
                  )}
                  {userData?.telegram && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500">T</span>
                      </div>
                      <span dir="ltr" className="flex-1 text-sm">{userData.telegram}</span>
                    </div>
                  )}
                  {userData?.instagram && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500">I</span>
                      </div>
                      <span dir="ltr" className="flex-1 text-sm">{userData.instagram}</span>
                    </div>
                  )}
                  {userData?.tiktok && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500">K</span>
                      </div>
                      <span dir="ltr" className="flex-1 text-sm">{userData.tiktok}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>جهات الاتصال في حالات الطوارئ</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {(userData?.emergencyName1 || userData?.emergencyPhone1) && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-2">جهة الاتصال الأولى</h3>
                      <div className="space-y-2">
                        <p>{userData.emergencyName1}</p>
                        <p className="text-sm text-gray-500">{userData.emergencyRelation1}</p>
                        <p dir="ltr" className="font-medium">{userData.emergencyPhone1}</p>
                      </div>
                    </div>
                  )}
                  {(userData?.emergencyName2 || userData?.emergencyPhone2) && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-2">جهة الاتصال الثانية</h3>
                      <div className="space-y-2">
                        <p>{userData.emergencyName2}</p>
                        <p className="text-sm text-gray-500">{userData.emergencyRelation2}</p>
                        <p dir="ltr" className="font-medium">{userData.emergencyPhone2}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              'إرسال الطلب'
            )}
          </Button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">تم استلام طلبك بنجاح</DialogTitle>
            <DialogDescription className="text-center pt-4">
              شكراً لإكمال عملية التسجيل. سيتم مراجعة طلبك خلال 7 أيام وسيتم إعلامك بالنتيجة.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button onClick={handleCloseDialog}>
              فهمت
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 