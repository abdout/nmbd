'use client';
import React, { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/components/onboarding/actions';
import { Input } from "@/components/ui/input";
import Address from '@/components/onboarding/address';
import { mockUser } from '@/components/onboarding/constant';
import Birthdate from '@/components/onboarding/birthdate';

const BasicInfo = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    username: '',
    bio: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        router.push("/onboarding/next-step");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" max-w-2xl mx-auto space-y-4">
      <div className="flex gap-4">
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="الاسم الكامل"
      />

      <Input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="اسم المستخدم"
      />
      </div>
      <div className="flex gap-4">
      <Address user={mockUser} />
      <Birthdate user={mockUser} />

      </div>
      
    </form>
  );
};

export default BasicInfo;