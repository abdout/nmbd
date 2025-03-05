'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { fetchUserForReview, completeOnboarding, type UserReviewData } from './action';
import Image from 'next/image';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok } from 'react-icons/fa';

// Arabic month names
const arabicMonths: Record<string, string> = {
  "1": "يناير",
  "2": "فبراير",
  "3": "مارس",
  "4": "أبريل",
  "5": "مايو",
  "6": "يونيو",
  "7": "يوليو",
  "8": "أغسطس",
  "9": "سبتمبر",
  "10": "أكتوبر",
  "11": "نوفمبر",
  "12": "ديسمبر"
};

// Format date to display Arabic month name and year
const formatDateWithArabicMonth = (date: Date): string => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${arabicMonths[month.toString()]} ${year}`;
};

// Helper function to convert PDF URL to preview URL
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          console.log("Loaded user data:", result.data);
          console.log("Skills:", result.data.skills);
          console.log("Interests:", result.data.interests);
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
    <div className="min-h-screen -mt-10">
      {/* <h1 className="font-heading text-5xl font-bold mb-4">{userData?.fullname || 'غير محدد'}</h1>
      <div className="flex flex-wrap  gap-x-6 gap-y-2 mb-8 text-sm text-gray-500">
        
        {userData?.phone && (
          <div className="flex items-center gap-2">
           الهاتف:
            <span dir="ltr">{userData.phone}</span>
          </div>
        )}
        {userData?.whatsapp && (
          <div className="flex items-center gap-2">
           الواتساب:
            <span dir="ltr">{userData.whatsapp}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          البريد الإلكتروني:
          <span dir="ltr">{userData?.email || 'غير محدد'}</span>
        </div>
      </div> */}

     
      
      {/* <div className="flex flex-row  gap-10">
        <div className="relative flex items-center justify-center w-36 h-28 overflow-hidden border border-neutral-500 rounded-lg">
          {userData?.image ? (
            <Image
              src={userData.image}
              alt="الصورة الشخصية"
              width={160}
              height={128}
              className="absolute inset-0 w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-center text-gray-700 text-sm z-10 whitespace-pre-line">
              الصورة الشخصية
            </span>
          )}
        </div>

        <div className="relative flex items-center justify-center w-36 h-28 overflow-hidden border border-neutral-500 rounded-lg">
          {userData?.cv ? (
            <div className="relative w-full h-full">
              <Image
                src={getPdfPreviewUrl(userData.cv)}
                alt="السيرة الذاتية"
                width={160}
                height={128}
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

        <div className="relative flex items-center justify-center w-36 h-28 overflow-hidden border border-neutral-500 rounded-lg">
          {userData?.portfolio ? (
            <div className="relative w-full h-full">
              <Image
                src={getPdfPreviewUrl(userData.portfolio)}
                alt="البورتفوليو"
                width={160}
                height={128}
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

        <div className="relative flex items-center justify-center w-36 h-28 overflow-hidden border border-neutral-500 rounded-lg">
          {userData?.additionalFile ? (
            <div className="relative w-full h-full">
              <Image
                src={getPdfPreviewUrl(userData.additionalFile)}
                alt="ملف إضافي"
                width={160}
                height={128}
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
      </div> */}
      
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
                    <p className="text-sm text-gray-500">الاسم الكامل</p>
                    <p>{userData?.fullname || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p>{userData?.email || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p>{userData?.phone || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">واتساب</p>
                    <p>{userData?.whatsapp || 'غير محدد'}</p>
                  </div>
                  
                  {/* Birth Information */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">مكان الميلاد</p>
                    <p>
                      {userData?.birthCountry && userData?.birthLocality 
                        ? `${userData.birthCountry} - ${userData.birthLocality}` 
                        : userData?.birthCountry || userData?.birthLocality || 'غير محدد'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p>
                      {userData?.birthMonth && userData?.birthYear 
                        ? `${arabicMonths[userData.birthMonth] || userData.birthMonth} ${userData.birthYear}` 
                        : 'غير محدد'}
                    </p>
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
                  {/* {userData?.educationLevel && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">المستوى التعليمي</p>
                      <p className="font-medium">{userData.educationLevel}</p>
                    </div>
                  )} */}
                  
                  {/* Student Information */}
                  {userData?.educationLevel === "student" && userData?.studentInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        طالب في {userData.studentInstitution}
                        {userData.studentFaculty ? ` تخصص ${userData.studentFaculty}` : ''}
                        {userData.studentYear ? ` - السنة ${userData.studentYear}` : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* PhD Information */}
                  {userData?.phdInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        دكتوراه {userData.phdMajor ? `${userData.phdMajor}` : ''}
                        {userData.phdInstitution ? `, ${userData.phdInstitution}` : ''}
                        {userData.phdCompletionYear ? ` - ${userData.phdCompletionYear}` : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* Master's Information */}
                  {userData?.masterInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        ماجستير {userData.masterMajor ? `${userData.masterMajor}` : ''}
                        {userData.masterInstitution ? `, ${userData.masterInstitution}` : ''}
                        {userData.masterCompletionYear ? ` - ${userData.masterCompletionYear}` : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* Bachelor's Information */}
                  {userData?.bachelorInstitution && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        بكالوريوس {userData.bachelorMajor ? `${userData.bachelorMajor}` : ''}
                        {userData.bachelorInstitution ? `, ${userData.bachelorInstitution}` : ''}
                        {userData.bachelorCompletionYear ? ` - ${userData.bachelorCompletionYear}` : ''}
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
                {userData?.currentOccupation && (
                  <div className="space-y-4">
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        {userData.currentOccupation}
                        {userData.companyName ? ` في ${userData.companyName}` : ''}
                        {userData.employmentSector ? ` (${userData.employmentSector})` : ''}
                      </p>
                      {userData.workplaceAddress && (
                        <p className="text-sm text-gray-700 mt-1">{userData.workplaceAddress}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Activities Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>الأنشطة والانتماءات</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
              <div className='flex flex-col md:flex-row space-x-10 pb-6 -ml-10'>
                  {/* Skills */}
                  {(() => { console.log("Skills check:", userData?.skills, userData?.skills?.length); return null; })()}
                  {userData?.skills && userData.skills.length > 0 && (
                    <div className="w-1/2 ">
                      <p className="text-sm text-gray-500">المهارات</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {userData.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-neutral-100 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Interests */}
                  {(() => { console.log("Interests check:", userData?.interests, userData?.interests?.length); return null; })()}
                  {userData?.interests && userData.interests.length > 0 && (
                    <div className="w-1/2">
                     <p className="text-sm text-gray-500 ">الاهتمامات</p>
                      <div className="flex gap-2 mt-2">
                        {userData.interests.map((interest, index) => (
                          <span key={index} className="px-2 py-1 bg-neutral-100 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                <div className="space-y-6">
                  {/* Political Party */}
                  {userData?.partyMember && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        عضو في {userData.partyName ? `حزب ${userData.partyName}` : 'حزب سياسي'}
                        {(userData?.partyStartDate || userData?.partyEndDate) && ' في الفترة من '}
                        {userData.partyStartDate ? formatDateWithArabicMonth(new Date(userData.partyStartDate)) : ''}
                        {userData.partyEndDate ? ` إلى ${formatDateWithArabicMonth(new Date(userData.partyEndDate))}` : userData.partyStartDate ? ' حتى الآن' : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* Union */}
                  {userData?.unionMember && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        عضو في {userData.unionName ? `نقابة ${userData.unionName}` : 'نقابة'}
                        {(userData?.unionStartDate || userData?.unionEndDate) && ' في الفترة من '}
                        {userData.unionStartDate ? formatDateWithArabicMonth(new Date(userData.unionStartDate)) : ''}
                        {userData.unionEndDate ? ` إلى ${formatDateWithArabicMonth(new Date(userData.unionEndDate))}` : userData.unionStartDate ? ' حتى الآن' : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* NGO */}
                  {userData?.ngoMember && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        عضو في {userData.ngoName ? `منظمة ${userData.ngoName}` : 'منظمة غير حكومية'}
                        {userData?.ngoActivity ? ` (${userData.ngoActivity})` : ''}
                      </p>
                    </div>
                  )}
                  
                  {/* Club */}
                  {userData?.clubMember && (
                    <div className="border-r-4 border-primary pr-4 py-2">
                      <p className="text-md">
                        عضو في {userData.clubName ? `نادي ${userData.clubName}` : 'نادي'}
                        {userData?.clubType ? ` (${userData.clubType})` : ''}
                      </p>
                    </div>
                  )}
                  
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Info Column */}
          <div className="space-y-8">
            {/* Location Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>العنوان الحالي</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {userData?.currentCountry && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">الدولة</p>
                      <p>{userData.currentCountry}</p>
                    </div>
                  )}
                  {userData?.currentLocality && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">المحلية</p>
                      <p>{userData.currentLocality}</p>
                    </div>
                  )}
                  {userData?.currentNeighborhood && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">الحي</p>
                      <p>{userData.currentNeighborhood}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Original Location (If different) */}
            {(userData?.originalCountry || userData?.originalLocality) && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>العنوان الأصلي</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {userData?.originalCountry && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">الدولة</p>
                        <p>{userData.originalCountry}</p>
                      </div>
                    )}
                    {userData?.originalLocality && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">المحلية</p>
                        <p>{userData.originalLocality}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  {userData?.twitter && (
                    <Link href={userData.twitter.startsWith('http') ? userData.twitter : `https://twitter.com/${userData.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" 
                      className="hover:opacity-70 transition-opacity">
                      <FaTwitter size={32} className="text-gray-700" />
                    </Link>
                  )}
                  {userData?.facebook && (
                    <Link href={userData.facebook.startsWith('http') ? userData.facebook : `https://facebook.com/${userData.facebook}`} target="_blank" rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity">
                      <FaFacebook size={32} className="text-gray-700" />
                    </Link>
                  )}
                  {userData?.linkedin && (
                    <Link href={userData.linkedin.startsWith('http') ? userData.linkedin : `https://linkedin.com/in/${userData.linkedin}`} target="_blank" rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity">
                      <FaLinkedin size={32} className="text-gray-700" />
                    </Link>
                  )}
                  {userData?.telegram && (
                    <Link href={userData.telegram.startsWith('http') ? userData.telegram : `https://t.me/${userData.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity">
                      <FaTelegram size={32} className="text-gray-700" />
                    </Link>
                  )}
                  {userData?.instagram && (
                    <Link href={userData.instagram.startsWith('http') ? userData.instagram : `https://instagram.com/${userData.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity">
                      <FaInstagram size={32} className="text-gray-700" />
                    </Link>
                  )}
                  {userData?.tiktok && (
                    <Link href={userData.tiktok.startsWith('http') ? userData.tiktok : `https://tiktok.com/@${userData.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity">
                      <FaTiktok size={32} className="text-gray-700" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attachments Card */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle>المرفقات</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {userData?.image && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image 
                          src={userData.image} 
                          alt="الصورة الشخصية" 
                          width={40} 
                          height={40} 
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      </div>
                      <span className="text-sm">الصورة الشخصية</span>
                    </div>
                  )}
                  {userData?.cv && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs">PDF</span>
                      </div>
                      <span className="text-sm">السيرة الذاتية</span>
                    </div>
                  )}
                  {userData?.portfolio && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs">PDF</span>
                      </div>
                      <span className="text-sm">البورتفوليو</span>
                    </div>
                  )}
                  {userData?.additionalFile && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs">PDF</span>
                      </div>
                      <span className="text-sm">ملف إضافي</span>
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