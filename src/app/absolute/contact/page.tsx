import { Suspense } from 'react';
import ContactForm from '@/components/onboarding/contact/form';
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function Contact() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  // Get existing contact if any
  const contact = await db.contact.findUnique({
    where: { userId: user.id }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Lab: Contact Form Test</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ContactForm 
            type={contact ? "update" : "create"}
            data={contact || undefined}
          />
        </Suspense>
      </div>
    </div>
  );
}