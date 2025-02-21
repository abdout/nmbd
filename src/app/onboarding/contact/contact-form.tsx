'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
import UpdateButton from "@/components/onboarding/update-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaPhone, FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok } from 'react-icons/fa';

type FormDataKey = "phone" | "whatsapp" | "twitter" | "facebook" | "linkedin" | "telegram" | "instagram" | "tiktok";

const Contact = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState<Record<FormDataKey, string>>({
    phone: user?.phone || "",
    whatsapp: user?.whatsapp || "",
    twitter: user?.twitter || "",
    facebook: user?.facebook || "",
    linkedin: user?.linkedin || "",
    telegram: user?.telegram || "",
    instagram: user?.instagram || "",
    tiktok: user?.tiktok || "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);  // Track form submission status
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as FormDataKey]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setError(false);
    setPending(true);  // Start submission

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
      setPending(false);  // End submission
    }
  };

  const tabsData = [
    { icon: <FaTiktok size={24} />, field: "تيك توك", placeholder: "@username" },
    { icon: <FaInstagram size={24} />, field: "انستغرام", placeholder: "@username" },
    { icon: <FaLinkedin size={24} />, field: "لنكدن", placeholder: "https://linkedin.com/in/username" },
    { icon: <FaTelegram size={24} />, field: "تلغرام", placeholder: "@username" },
    { icon: <FaFacebook size={24} />, field: "فيسبوك", placeholder: "https://facebook.com/username" },
    { icon: <FaTwitter size={24} />, field: "تويتر", placeholder: "https://twitter.com/username" },
    { icon: <FaWhatsapp size={24} />, field: "واتساب", placeholder: "+1234567890" },
    { icon: <FaPhone size={20} />, field: "هاتف", placeholder: "+1234567890" },    
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <Tabs defaultValue="هاتف" dir="rtl"> {/* Set defaultValue to "هاتف" */}
        

        {tabsData.map(({ icon, field, placeholder }) => (
          <TabsContent key={field} value={field}> {/* Ensure value matches field */}
            <Card>
              <CardHeader />
              <CardContent className="-mt-12">
                <Label className="flex items-center gap-2 py-2">
                  {/* {icon} */}
                   {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  type="text"
                  name={field}
                  value={formData[field as FormDataKey]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-3 h-9 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
         <div className="flex items-center justify-between">
          <TabsList className="flex gap-2 bg-background">
            {tabsData.slice().reverse().map(({ icon, field }) => (
              <TabsTrigger key={field} value={field} className="p-1 flex justify-center">
                {icon}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className=" justify-end">
        {/* <UpdateButton pending={pending} /> */}
        {success && (
          <p className="text-green-500 text-sm mt-2">
            Contact information updated successfully!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2">
            Failed to update contact information. Please try again.
          </p>
        )}
      </div>
    </form>
  );
};

export default Contact;
