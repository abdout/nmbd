'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/components/onboarding/actions";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BirthDateFormData {
  birthDate: string;
  birthMonth: number;
  birthYear: number;
}

const Birthdate = ({ user }: { user: User }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<BirthDateFormData>({
    birthDate: user?.birthDate?.toString() || "",
    birthMonth: Number(user?.birthMonth) || 0,
    birthYear: Number(user?.birthYear) || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'birthDate' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await updateProfile({
        ...formData,
        birthDate: new Date(formData.birthDate)
      });
      
      if (response.success) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <Tabs defaultValue="birthdate" className="w-full" dir="rtl">
        <TabsContent value="birthdate">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <Input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
              <Input
                type="number"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                min={1}
                max={12}
                placeholder="الشهر"
              />
              <Input
                type="number"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                min={1900}
                max={new Date().getFullYear()}
                placeholder="السنة"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default Birthdate;

