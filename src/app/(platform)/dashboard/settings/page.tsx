'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center h-full text-center">
      <h1 className="text-3xl font-bold mb-4">الإعدادات</h1>
      <p className="text-lg text-muted-foreground mb-8">ضبط خيارات المنصة والحساب</p>
      
      <div className=" rounded-lg p-8 max-w-xl w-full ">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 text-start">
            <h3 className="text-lg font-medium">إعدادات الحساب</h3>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">تغيير كلمة المرور</p>
                <p className="text-sm text-muted-foreground">قم بتحديث كلمة المرور الخاصة بك</p>
              </div>
              <button className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors">
                تعديل
              </button>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">إعدادات الإشعارات</p>
                <p className="text-sm text-muted-foreground">تحكم في كيفية تلقي الإشعارات</p>
              </div>
              <button className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors">
                تعديل
              </button>
            </div>
            
            
          </div>
          
          <div className="mt-6 text-start">
           
            
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setLoading(true);
    try {
      // Get user id from session or context if available, else fetch from API
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      const userId = session?.user?.id;
      if (!userId) throw new Error('لم يتم العثور على معرف المستخدم');
      const deleteRes = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (deleteRes.status === 204) {
        // Sign out after deletion
        await fetch('/api/auth/signout');
        router.push('/login');
      } else {
        alert('حدث خطأ أثناء حذف الحساب');
      }
    } catch (e) {
      alert('حدث خطأ أثناء حذف الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors w-32 text-center border border-red-600"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? 'جاري حذف الحساب...' : 'حذف الحساب'}
    </button>
  );
} 