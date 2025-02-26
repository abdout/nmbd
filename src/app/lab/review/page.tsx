'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/components/auth/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { fetchUserForReview, completeOnboarding, type UserReviewData } from './action';

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
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">مراجعة المعلومات</h1>
      <p className="text-center text-neutral-600 mb-10">
        الرجاء مراجعة جميع المعلومات التي قمت بإدخالها والتأكد من صحتها قبل الإرسال النهائي
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">الاسم:</span>
              <span>{userData?.fullname || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">البريد الإلكتروني:</span>
              <span>{userData?.email || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الهاتف:</span>
              <span>{userData?.phone || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">واتساب:</span>
              <span>{userData?.whatsapp || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">تاريخ الميلاد:</span>
              <span>{userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString('ar') : 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">شهر الميلاد:</span>
              <span>{userData?.birthMonth || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">سنة الميلاد:</span>
              <span>{userData?.birthYear || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الجنس:</span>
              <span>{userData?.gender || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الحالة الاجتماعية:</span>
              <span>{userData?.maritalStatus || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الديانة:</span>
              <span>{userData?.religion || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">رقم الهوية الوطنية:</span>
              <span>{userData?.nationalityId || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">تويتر:</span>
              <span>{userData?.twitter || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">فيسبوك:</span>
              <span>{userData?.facebook || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">لينكد إن:</span>
              <span>{userData?.linkedin || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">تيليجرام:</span>
              <span>{userData?.telegram || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">انستجرام:</span>
              <span>{userData?.instagram || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">تيك توك:</span>
              <span>{userData?.tiktok || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>العنوان الحالي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">البلد:</span>
              <span>{userData?.currentCountry || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الولاية:</span>
              <span>{userData?.currentState || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">المحلية:</span>
              <span>{userData?.currentLocality || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الوحدة الإدارية:</span>
              <span>{userData?.currentAdminUnit || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الحي:</span>
              <span>{userData?.currentNeighborhood || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>مكان الميلاد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">البلد:</span>
              <span>{userData?.birthCountry || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الولاية:</span>
              <span>{userData?.birthState || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">المحلية:</span>
              <span>{userData?.birthLocality || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الوحدة الإدارية:</span>
              <span>{userData?.birthAdminUnit || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الحي:</span>
              <span>{userData?.birthNeighborhood || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>العنوان الأصلي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">البلد:</span>
              <span>{userData?.originalCountry || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الولاية:</span>
              <span>{userData?.originalState || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">المحلية:</span>
              <span>{userData?.originalLocality || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الوحدة الإدارية:</span>
              <span>{userData?.originalAdminUnit || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الحي:</span>
              <span>{userData?.originalNeighborhood || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التعليم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">المستوى التعليمي:</span>
              <span>{userData?.educationLevel || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">المؤسسة التعليمية:</span>
              <span>{userData?.institution || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">التخصص:</span>
              <span>{userData?.major || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">سنة التخرج:</span>
              <span>{userData?.yearOfCompletion || 'غير محدد'}</span>
            </div>
            {userData?.educationLevel === 'student' && (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">مؤسسة الطالب:</span>
                  <span>{userData?.studentInstitution || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">كلية:</span>
                  <span>{userData?.studentFaculty || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">السنة الدراسية:</span>
                  <span>{userData?.studentYear || 'غير محدد'}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التعليم العالي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(userData?.bachelorInstitution || userData?.bachelorMajor || userData?.bachelorCompletionYear) && (
              <>
                <div className="font-medium border-b pb-1 mb-2">بكالوريوس</div>
                <div className="flex justify-between">
                  <span className="font-medium">المؤسسة:</span>
                  <span>{userData?.bachelorInstitution || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">التخصص:</span>
                  <span>{userData?.bachelorMajor || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">سنة التخرج:</span>
                  <span>{userData?.bachelorCompletionYear || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {(userData?.masterInstitution || userData?.masterMajor || userData?.masterCompletionYear) && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">ماجستير</div>
                <div className="flex justify-between">
                  <span className="font-medium">المؤسسة:</span>
                  <span>{userData?.masterInstitution || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">التخصص:</span>
                  <span>{userData?.masterMajor || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">سنة التخرج:</span>
                  <span>{userData?.masterCompletionYear || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {(userData?.phdInstitution || userData?.phdMajor || userData?.phdCompletionYear) && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">دكتوراه</div>
                <div className="flex justify-between">
                  <span className="font-medium">المؤسسة:</span>
                  <span>{userData?.phdInstitution || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">التخصص:</span>
                  <span>{userData?.phdMajor || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">سنة التخرج:</span>
                  <span>{userData?.phdCompletionYear || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {(userData?.professorInstitution || userData?.professorMajor || userData?.professorCompletionYear) && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">أستاذ</div>
                <div className="flex justify-between">
                  <span className="font-medium">المؤسسة:</span>
                  <span>{userData?.professorInstitution || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">التخصص:</span>
                  <span>{userData?.professorMajor || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">سنة التعيين:</span>
                  <span>{userData?.professorCompletionYear || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {!userData?.bachelorInstitution && !userData?.masterInstitution && !userData?.phdInstitution && !userData?.professorInstitution && (
              <div className="text-center text-neutral-500">لا توجد معلومات تعليم عالي مسجلة</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>العمل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">المهنة الحالية:</span>
              <span>{userData?.currentOccupation || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">قطاع العمل:</span>
              <span>{userData?.employmentSector || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">عنوان العمل:</span>
              <span>{userData?.workplaceAddress || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">اسم الشركة:</span>
              <span>{userData?.companyName || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأنشطة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {userData?.partyMember && (
              <>
                <div className="font-medium border-b pb-1 mb-2">عضوية حزبية</div>
                <div className="flex justify-between">
                  <span className="font-medium">اسم الحزب:</span>
                  <span>{userData?.partyName || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">تاريخ البدء:</span>
                  <span>{userData?.partyStartDate ? new Date(userData.partyStartDate).toLocaleDateString('ar') : 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">تاريخ الانتهاء:</span>
                  <span>{userData?.partyEndDate ? new Date(userData.partyEndDate).toLocaleDateString('ar') : 'مستمر'}</span>
                </div>
              </>
            )}
            
            {userData?.unionMember && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">عضوية نقابية</div>
                <div className="flex justify-between">
                  <span className="font-medium">اسم النقابة:</span>
                  <span>{userData?.unionName || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">تاريخ البدء:</span>
                  <span>{userData?.unionStartDate ? new Date(userData.unionStartDate).toLocaleDateString('ar') : 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">تاريخ الانتهاء:</span>
                  <span>{userData?.unionEndDate ? new Date(userData.unionEndDate).toLocaleDateString('ar') : 'مستمر'}</span>
                </div>
              </>
            )}
            
            {userData?.ngoMember && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">عضوية منظمة</div>
                <div className="flex justify-between">
                  <span className="font-medium">اسم المنظمة:</span>
                  <span>{userData?.ngoName || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">نشاط المنظمة:</span>
                  <span>{userData?.ngoActivity || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {userData?.clubMember && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">عضوية نادي</div>
                <div className="flex justify-between">
                  <span className="font-medium">اسم النادي:</span>
                  <span>{userData?.clubName || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">نوع النادي:</span>
                  <span>{userData?.clubType || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {!userData?.partyMember && !userData?.unionMember && !userData?.ngoMember && !userData?.clubMember && (
              <div className="text-center text-neutral-500">لا توجد أنشطة مسجلة</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>جهات الاتصال في حالات الطوارئ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(userData?.emergencyName1 || userData?.emergencyPhone1) && (
              <>
                <div className="font-medium border-b pb-1 mb-2">جهة الاتصال الأولى</div>
                <div className="flex justify-between">
                  <span className="font-medium">الاسم:</span>
                  <span>{userData?.emergencyName1 || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">صلة القرابة:</span>
                  <span>{userData?.emergencyRelation1 || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">الهاتف:</span>
                  <span>{userData?.emergencyPhone1 || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {(userData?.emergencyName2 || userData?.emergencyPhone2) && (
              <>
                <div className="font-medium border-b pb-1 mb-2 mt-4">جهة الاتصال الثانية</div>
                <div className="flex justify-between">
                  <span className="font-medium">الاسم:</span>
                  <span>{userData?.emergencyName2 || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">صلة القرابة:</span>
                  <span>{userData?.emergencyRelation2 || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">الهاتف:</span>
                  <span>{userData?.emergencyPhone2 || 'غير محدد'}</span>
                </div>
              </>
            )}
            
            {!userData?.emergencyName1 && !userData?.emergencyPhone1 && !userData?.emergencyName2 && !userData?.emergencyPhone2 && (
              <div className="text-center text-neutral-500">لا توجد جهات اتصال طوارئ مسجلة</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المرفقات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">السيرة الذاتية:</span>
              <span>{userData?.cv ? 'مرفق' : 'غير مرفق'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">البورتفوليو:</span>
              <span>{userData?.portfolio ? 'مرفق' : 'غير مرفق'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الصورة الشخصية:</span>
              <span>{userData?.image ? 'مرفقة' : 'غير مرفقة'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ملف إضافي:</span>
              <span>{userData?.additionalFile ? 'مرفق' : 'غير مرفق'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات أخرى</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">مصدر التعرف:</span>
              <span>{userData?.referralSource || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">اسم المعرف:</span>
              <span>{userData?.acquaintanceName || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">مبلغ التبرع:</span>
              <span>{userData?.donationAmount || 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">تاريخ التبرع:</span>
              <span>{userData?.donationDate ? new Date(userData.donationDate).toLocaleDateString('ar') : 'غير محدد'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">الإقرار بالقسم:</span>
              <span>{userData?.oathAcknowledged ? 'تم الإقرار' : 'لم يتم الإقرار'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="px-8 py-6 text-lg"
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