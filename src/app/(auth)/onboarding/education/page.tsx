'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
import UpdateButton from "@/components/onboarding/UpdateButton";
import { FaGraduationCap, FaBriefcase, FaBuilding } from 'react-icons/fa';

const Education = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState({
    educationLevel: user?.educationLevel || "",
    institution: user?.institution || "",
    yearOfCompletion: user?.yearOfCompletion?.toString() || "", // Convert to string for input
    currentOccupation: user?.currentOccupation || "",
    employmentSector: user?.employmentSector || "",
    workplaceAddress: user?.workplaceAddress || "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const [pending, setPending] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        yearOfCompletion: formData.yearOfCompletion ? parseInt(formData.yearOfCompletion) : undefined,
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
          <FaGraduationCap className="text-purple-500" />
          Education & Employment
        </h2>

        {/* Education Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Education Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Education Level</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Level</option>
                <option value="High School">High School</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Institution</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Educational institution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year of Completion</label>
              <input
                type="number"
                name="yearOfCompletion"
                value={formData.yearOfCompletion} // This is now a string
                onChange={handleChange}
                min="1900"
                max="2099"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="YYYY"
              />
            </div>
          </div>
        </div>

        {/* Employment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Occupation</label>
              <input
                type="text"
                name="currentOccupation"
                value={formData.currentOccupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Current job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Employment Sector</label>
              <input
                type="text"
                name="employmentSector"
                value={formData.employmentSector}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Industry sector"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Workplace Address</label>
              <input
                type="text"
                name="workplaceAddress"
                value={formData.workplaceAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Work location address"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <UpdateButton pending={pending} />
        {success && (
          <p className="text-green-500 text-sm mt-2">
            Education and employment information updated successfully!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">
            Failed to update information. Please try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default Education;
