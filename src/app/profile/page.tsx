'use client';
import React, { useState, useEffect } from 'react';
import { useCurrentUser } from "@/components/auth/hooks/use-current-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUserById } from '@/components/auth/data/user';
import { updateProfile } from '@/lib/action';
import { Edit } from 'lucide-react';

const ProfilePage = () => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    phone: '',
    whatsapp: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    telegram: '',
    instagram: '',
    tiktok: '',
    currentCountry: '',
    currentState: '',
    currentLocality: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const data = await getUserById(user.id);
        if (data) {
          setUserData({
            name: data.name || '',
            username: data.fullname || '',
            email: data.email || '',
            bio: data.bio || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            twitter: data.twitter || '',
            facebook: data.facebook || '',
            linkedin: data.linkedin || '',
            telegram: data.telegram || '',
            instagram: data.instagram || '',
            tiktok: data.tiktok || '',
            currentCountry: data.currentCountry || '',
            currentState: data.currentState || '',
            currentLocality: data.currentLocality || '',
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({ success: false, error: false }, userData);

      if (result.success) {
        toast.success("تم تحديث الملف الشخصي بنجاح");
        setIsEditing(false);
      } else {
        toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  type Field = {
    key: keyof typeof userData;
    label: string;
    disabled?: boolean;
  };

  const fields: Field[] = [
    { key: 'name', label: 'الاسم' },
    { key: 'username', label: 'اسم المستخدم' },
    { key: 'email', label: 'البريد الإلكتروني', disabled: true },
    { key: 'bio', label: 'نبذة شخصية' },
    { key: 'phone', label: 'رقم الهاتف' },
    { key: 'whatsapp', label: 'واتساب' },
    { key: 'twitter', label: 'تويتر' },
    { key: 'facebook', label: 'فيسبوك' },
    { key: 'linkedin', label: 'لينكد إن' },
    { key: 'telegram', label: 'تلغرام' },
    { key: 'instagram', label: 'انستغرام' },
    { key: 'tiktok', label: 'تيك توك' },
    { key: 'currentCountry', label: 'الدولة' },
    { key: 'currentState', label: 'الولاية' },
    { key: 'currentLocality', label: 'المدينة' },
  ] as const;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>الملف الشخصي</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(field => (
                <div key={field.key} className="flex flex-col space-y-1.5">
                  <Input
                    name={field.key}
                    value={userData[field.key]}
                    onChange={handleChange}
                    placeholder={field.label}
                    disabled={field.disabled}
                  />
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {fields.map(field => (
                <div key={field.key} className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">{field.label}</span>
                  <span className={!userData[field.key] ? "text-gray-400 italic" : ""}>
                    {userData[field.key] || "غير محدد"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage; 