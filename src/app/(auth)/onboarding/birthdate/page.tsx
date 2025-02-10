'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/x/actions";
import UpdateButton from "@/components/x/rightMenu/UpdateButton";
import { FaBirthdayCake, FaGlobeAmericas, FaMapMarkerAlt } from 'react-icons/fa';

const Birthdate = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState({
    birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
    birthCountry: user?.birthCountry || "",
    birthState: user?.birthState || "",
    birthLocality: user?.birthLocality || "",
    birthAdminUnit: user?.birthAdminUnit || "",
    birthNeighborhood: user?.birthNeighborhood || "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

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

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FaBirthdayCake className="text-blue-500" />
          Birth Information
        </h2>

        <div>
          <label className="block text-sm font-medium mb-2">Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              name="birthCountry"
              value={formData.birthCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Country of birth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">State/Province</label>
            <input
              type="text"
              name="birthState"
              value={formData.birthState}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State or province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">City/Locality</label>
            <input
              type="text"
              name="birthLocality"
              value={formData.birthLocality}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City or locality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Administrative Unit</label>
            <input
              type="text"
              name="birthAdminUnit"
              value={formData.birthAdminUnit}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Administrative unit"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Neighborhood</label>
            <input
              type="text"
              name="birthNeighborhood"
              value={formData.birthNeighborhood}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Neighborhood"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <UpdateButton />
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