'use client';
import React, { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/components/onboarding/actions';
import UpdateButton from '@/components/onboarding/update-button';
import { Input } from "@/components/ui/input";
import Address from '@/components/onboarding/address';
import { mockUser } from '@/components/onboarding/constant';
import Birthdate from '@/components/onboarding/birthdate';


const BasicInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    username: '',
    bio: '',
    gender: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace this with your actual user data fetching logic
        const response = await fetch('/api/user');
        const userData: User = await response.json();

        setFormData({
          name: userData?.name || '',
          nickname: userData?.name || '', // Assuming nickname maps to name
          username: userData?.name || '', // Assuming username maps to name
          bio: userData?.bio || '',
          gender: userData?.gender || '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(true);
      }
    };

    fetchUserData();
  }, []);

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
    setPending(true);

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
    } finally {
      setPending(false);
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