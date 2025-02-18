'use client';
import React, { useState } from 'react';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/components/onboarding/actions';
import UpdateButton from '@/components/onboarding/update-button';

const BasicInfo = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nickname: user?.nickname || '',
    username: user?.username || '',
    bio: user?.bio || '',
    gender: user?.gender || '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">الاسم</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="الاسم الكامل"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">الكنية</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="الكنية"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">اسم المستخدم</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="اسم المستخدم"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">السيرة الذاتية</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="السيرة الذاتية"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الجنس</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="الجنس"
          />
        </div>
      </div>

      <div className="mt-6">
        <UpdateButton pending={pending} />
        {success && (
          <p className="text-green-500 text-sm mt-2">تم تحديث المعلومات بنجاح!</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">فشل في تحديث المعلومات. حاول مرة أخرى.</p>
        )}
      </div>
    </form>
  );
};

export default BasicInfo;
