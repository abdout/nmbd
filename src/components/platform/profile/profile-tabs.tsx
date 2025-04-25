'use client'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileAbout } from './profile-about';
import { ProfileEducation } from './profile-education';
import { ProfileSkills } from './profile-skills';
import { ProfileActivities } from './profile-activities';
import { motion } from "framer-motion";
import { useState } from 'react';

interface ProfileTabsProps {
  user: any; // Using any here for simplicity, in a real app would define a proper interface
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("about");
  
  return (
    <Tabs 
      dir="rtl" 
      defaultValue="about" 
      className="w-full mt-4"
      onValueChange={(value) => setActiveTab(value)}
    >
      <div className="border-b border-gray-200 relative">
        <TabsList className="flex w-[full] justify-end gap-2 bg-transparent hover:bg-transparent">
          <TabsTrigger 
            value="about" 
            className="flex-1 rounded-none py-3 px-6 text-gray-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !bg-transparent"
          >
            حول
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="flex-1 rounded-none py-3 px-6 text-gray-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !bg-transparent"
          >
            التعليم
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="flex-1 rounded-none py-3 px-6 text-gray-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !bg-transparent"
          >
            المهارات
          </TabsTrigger>
          <TabsTrigger 
            value="activities" 
            className="flex-1 rounded-none py-3 px-6 text-gray-500 data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !bg-transparent"
          >
            التفاعل
          </TabsTrigger>
        </TabsList>
        
        {/* Animated bottom line with Framer Motion */}
        <motion.div 
          className="absolute bottom-0 h-0.5 bg-black"
          animate={{
            left: activeTab === "activities" ? '0%' : 
                  activeTab === "skills" ? '25%' : 
                  activeTab === "education" ? '50%' : '75%',
            right: activeTab === "about" ? '0%' : 
                   activeTab === "education" ? '25%' : 
                   activeTab === "skills" ? '50%' : '75%'
          }}
          transition={{
            type: "tween",
            duration: 0.6,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Tab contents with styling */}
      <TabsContent value="about" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileAbout user={user} />
      </TabsContent>
      
      <TabsContent value="education" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileEducation user={user} />
      </TabsContent>
      
      <TabsContent value="skills" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileSkills user={user} />
      </TabsContent>
      
      <TabsContent value="activities" className="mt-6 bg-white p-4 rounded-lg">
        <ProfileActivities user={user} />
      </TabsContent>
    </Tabs>
  );
} 