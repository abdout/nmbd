"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactSchema, ContactSchema } from "./validation";
import { createContact, updateContact } from "./action";
import { useActionState } from "react";
import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FaPhone, FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useFormContext } from '@/components/twitter/edit/form-context';
import { getNextRoute } from '../utils';
import { SuccessToast, ErrorToast, showValidationErrorToast } from '@/components/atom/toast';

type ContactField = keyof Omit<ContactSchema, 'id'>;

const tabsData: Array<{icon: React.ReactElement, name: ContactField, label: string, placeholder: string, showOnMobile?: boolean}> = [
  // { icon: <FaTiktok size={26} />, name: 'tiktok', label: 'تيك توك', placeholder: '@username' },
  // { icon: <FaInstagram size={26} />, name: 'instagram', label: 'انستجرام', placeholder: '@username' },
  { icon: <FaLinkedin size={40} />, name: 'linkedin', label: 'لينكدان', placeholder: 'https://linkedin.com/in/username', showOnMobile: false },
  
  { icon: <FaFacebook size={70} />, name: 'facebook', label: 'فيسبوك', placeholder: 'https://facebook.com/username', showOnMobile: false },
  { icon: <FaTwitter size={70} />, name: 'twitter', label: 'تويتر', placeholder: 'https://twitter.com/username', showOnMobile: true },
  { icon: <FaTelegram size={70} />, name: 'telegram', label: 'تيليجرام', placeholder: '@username', showOnMobile: true },
  { icon: <FaWhatsapp size={70} />, name: 'whatsapp', label: 'واتساب', placeholder: '+1234567890', showOnMobile: true },
  { icon: <FaPhone size={60} />, name: 'phone', label: 'الهاتف', placeholder: '+1234567890', showOnMobile: true },
];

const ContactForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: ContactSchema;
}) => {
  const { formRef, setCurrentFormId } = useFormContext();
  const [activeTab, setActiveTab] = useState<string>("phone");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: data || {
      phone: '',
      whatsapp: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      telegram: '',
      instagram: '',
      tiktok: '',
    }
  });

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    type === "create" ? createContact : updateContact,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    // Ensure all fields have at least empty string values
    const data = {
      phone: formData.phone || '',
      whatsapp: formData.whatsapp || '',
      twitter: formData.twitter || '',
      facebook: formData.facebook || '',
      linkedin: formData.linkedin || '',
      telegram: formData.telegram || '',
      instagram: formData.instagram || '',
      tiktok: formData.tiktok || '',
      id: formData.id
    };

    // Save to localStorage for step navigation tracking
    localStorage.setItem('contactFormData', JSON.stringify(data));

    startTransition(() => {
      formAction(data);
    });
  }, (errors) => {
    // Show error toast for validation errors
    if (errors.phone) {
      showValidationErrorToast(errors.phone.message || "رقم الهاتف مطلوب");
    } else if (errors.whatsapp) {
      showValidationErrorToast(errors.whatsapp.message || "طريقة اتصال اضافية مطلوبة");
    }
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      // Show success toast using the centralized component
      SuccessToast();
      
      // Navigate to next route with slight delay
      setTimeout(() => {
        router.push(getNextRoute(pathname));
      }, 300);
    } else if (state.error) {
      ErrorToast("فشل حفظ البيانات");
    }
  }, [state, router, pathname]);

  useEffect(() => {
    setCurrentFormId('contact');
  }, [setCurrentFormId]);

  return (
    <form 
      ref={formRef} 
      className="w-full flex flex-col p-2"
      
      onSubmit={onSubmit}
    >
      {data?.id && (
        <input type="hidden" {...register('id')} defaultValue={data.id} />
      )}

      <Tabs 
        defaultValue="phone" 
        dir="rtl"
        onValueChange={(value) => setActiveTab(value)}
      >
        {tabsData.map(({ name, label, placeholder }) => (
          <TabsContent key={name} value={name}>
            <Card>
              <CardContent>
                <Label className="flex items-center gap-2 py-2">
                  {label}
                </Label>
                <Input
                  id={name}
                  {...register(name)}
                  defaultValue={data?.[name] || ''}
                  placeholder={placeholder}
                  aria-invalid={errors[name] ? "true" : "false"}
                  className="w-full items-center justify-center border rounded-md"
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        <div className="flex items-center justify-center mb-4">
          <TabsList className="grid grid-cols-4 md:grid-cols-6 items-center justify-center gap-6 md:gap-4 bg-background">
            {tabsData.slice().reverse().map(({ icon, name, showOnMobile }) => (
              <TabsTrigger 
                key={name} 
                value={name} 
                className={`p-1 flex justify-center hover:bg-transparent focus:bg-transparent data-[state=active]:bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ${!showOnMobile ? 'hidden md:flex' : ''}`}
              >
                {React.cloneElement(icon as React.ReactElement<{className?: string}>, {
                  className: `transition-colors ${activeTab === name ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                })}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
      
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      
      <Button type="submit" className="hidden w-full mt-8" disabled={isPending}>
        {isPending ? "Saving..." : type === "create" ? "Create" : "Update"}
      </Button>

      <button 
        id="submit-contact" 
        type="submit" 
        className="hidden"
      />
    </form>
  );
};

export default ContactForm;