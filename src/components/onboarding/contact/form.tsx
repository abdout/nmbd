"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { contactSchema, ContactSchema } from "./validation";
import { createContact, updateContact } from "./action";
import { useActionState } from "react";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FaPhone, FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaTelegram, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useFormContext } from '@/components/onboarding/form-context';
import { getNextRoute } from '../utils';

type ContactField = keyof Omit<ContactSchema, 'id'>;

const tabsData: Array<{icon: React.ReactNode, name: ContactField, label: string, placeholder: string}> = [
  { icon: <FaTiktok size={24} />, name: 'tiktok', label: 'تيك توك', placeholder: '@username' },
  { icon: <FaInstagram size={24} />, name: 'instagram', label: 'انستجرام', placeholder: '@username' },
  { icon: <FaLinkedin size={24} />, name: 'linkedin', label: 'لينكدان', placeholder: 'https://linkedin.com/in/username' },
  { icon: <FaTelegram size={24} />, name: 'telegram', label: 'تيليجرام', placeholder: '@username' },
  { icon: <FaFacebook size={24} />, name: 'facebook', label: 'فيسبوك', placeholder: 'https://facebook.com/username' },
  { icon: <FaTwitter size={24} />, name: 'twitter', label: 'تويتر', placeholder: 'https://twitter.com/username' },
  { icon: <FaWhatsapp size={24} />, name: 'whatsapp', label: 'واتساب', placeholder: '+1234567890' },
  { icon: <FaPhone size={20} />, name: 'phone', label: 'الهاتف', placeholder: '+1234567890' },
];

const ContactForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: ContactSchema;
}) => {
  const { formRef, setCurrentFormId } = useFormContext();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
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

    startTransition(() => {
      formAction(data);
    });
  });

  const router = useRouter();
  const pathname = usePathname();

  const onSubmitSuccess = useCallback(() => {
    toast.success(`تم ${type === "create" ? "إنشاء" : "تحديث"} الاتصال بنجاح!`);
    router.push(getNextRoute(pathname));
  }, [router, pathname, type]);

  useEffect(() => {
    if (state.success) {
      toast.success("تم حفظ البيانات بنجاح");
      onSubmitSuccess();
    } else if (state.error) {
      toast.error("فشل حفظ البيانات");
    }
  }, [state, onSubmitSuccess]);

  useEffect(() => {
    setCurrentFormId('contact');
  }, [setCurrentFormId]);

  return (
    <form 
      ref={formRef} 
      className="max-w-2xl mx-auto" 
      onSubmit={onSubmit}
    >
      {data?.id && (
        <input type="hidden" {...register('id')} defaultValue={data.id} />
      )}

      <Tabs defaultValue="phone" dir="rtl">
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
                  className="w-full px-3 h-9 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[name] && (
                  <span className="text-sm text-red-500">
                    {errors[name]?.message}
                  </span>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        <div className="flex items-center justify-center md:justify-between mb-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-2 bg-background">
            {tabsData.slice().reverse().map(({ icon, name }) => (
              <TabsTrigger key={name} value={name} className="p-1 flex justify-center">
                {icon}
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