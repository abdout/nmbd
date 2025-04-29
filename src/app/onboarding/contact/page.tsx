import ContactForm from "@/components/onboarding/contact/form";
import { Suspense } from "react";
import { getContact } from "@/components/onboarding/contact/action";
import { ContactSchema } from "@/components/onboarding/contact/validation";

export default async function ContactPage() {
  const userData = await getContact();
  
  // Create a properly typed ContactSchema object from the userData
  const transformedData: ContactSchema | undefined = userData 
    ? {
        phone: userData.phone || '',
        whatsapp: userData.whatsapp || '',
        twitter: userData.twitter || '',
        facebook: userData.facebook || '',
        linkedin: userData.linkedin || '',
        telegram: userData.telegram || '',
        instagram: userData.instagram || '',
        tiktok: userData.tiktok || '',
      }
    : undefined;
  
  return (
    <div className=" p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm 
          type={userData ? "update" : "create"} 
          data={transformedData} 
        />
      </Suspense>
    </div>
  );
}