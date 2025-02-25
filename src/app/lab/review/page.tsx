'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { useCurrentUser } from '@/components/auth/hooks/use-current-user';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type UserData = {
  // Personal info
  fullname?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  birthDate?: Date;
  birthCountry?: string;
  birthState?: string;
  
  // Current location
  currentCountry?: string;
  currentState?: string;
  currentLocality?: string;
  
  // Education & Work
  educationLevel?: string;
  institution?: string;
  currentOccupation?: string;
  
  // Activities
  partyMember?: boolean;
  partyName?: string;
  unionMember?: boolean;
  unionName?: string;
  ngoMember?: boolean;
  ngoName?: string;
  clubMember?: boolean;
  clubName?: string;
  
  // Attachments
  cv?: string;
  portfolio?: string;
};

export default function ReviewPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${user.id}/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ onboardingStatus: 'COMPLETED' }),
      });
      
      if (response.ok) {
        setShowDialog(true);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التعليم والعمل</CardTitle>
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
              <span className="font-medium">المهنة الحالية:</span>
              <span>{userData?.currentOccupation || 'غير محدد'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأنشطة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {userData?.partyMember && (
              <div className="flex justify-between">
                <span className="font-medium">عضو حزب:</span>
                <span>{userData?.partyName || 'نعم'}</span>
              </div>
            )}
            {userData?.unionMember && (
              <div className="flex justify-between">
                <span className="font-medium">عضو نقابة:</span>
                <span>{userData?.unionName || 'نعم'}</span>
              </div>
            )}
            {userData?.ngoMember && (
              <div className="flex justify-between">
                <span className="font-medium">عضو منظمة:</span>
                <span>{userData?.ngoName || 'نعم'}</span>
              </div>
            )}
            {userData?.clubMember && (
              <div className="flex justify-between">
                <span className="font-medium">عضو نادي:</span>
                <span>{userData?.clubName || 'نعم'}</span>
              </div>
            )}
            {!userData?.partyMember && !userData?.unionMember && !userData?.ngoMember && !userData?.clubMember && (
              <div className="text-center text-neutral-500">لا توجد أنشطة مسجلة</div>
            )}
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