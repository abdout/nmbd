'use client';
import React, { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
import UpdateButton from "@/components/onboarding/update-button";
import { FaBirthdayCake } from 'react-icons/fa';
import { useSession } from "next-auth/react";

const Birthdate = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    birthDate: "",
    birthCountry: "",
    birthState: "",
    birthLocality: "",
    birthAdminUnit: "",
    birthNeighborhood: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUser(data.user);
        
        // Initialize form data after fetching user
        if (data.user) {
          setFormData({
            birthDate: data.user.birthDate 
              ? new Date(data.user.birthDate).toISOString().split('T')[0] 
              : "",
            birthCountry: data.user.birthCountry || "",
            birthState: data.user.birthState || "",
            birthLocality: data.user.birthLocality || "",
            birthAdminUnit: data.user.birthAdminUnit || "",
            birthNeighborhood: data.user.birthNeighborhood || "",
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUser();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);

    try {
      const response = await updateProfile({
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
      });
      
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

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FaBirthdayCake className="text-blue-500" />
          Birth Information
        </h2>

        {/* Rest of your form inputs remain the same */}

      </div>

      <div className="mt-6">
        {/* <UpdateButton /> */}
        {success && (
          <p className="text-green-500 text-sm mt-2">
            Birth information updated successfully!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">
            Failed to update birth information. Please try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default Birthdate;