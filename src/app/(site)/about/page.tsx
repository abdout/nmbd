'use client'
import { HoverEffect } from '@/components/atom/card-hover';
import React from 'react'

const About = () => {
  return (
    <div>
      <CardHoverEffectDemo />
    </div>
  )
}

export default About



export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={FeaturedVideos()} />
    </div>
  );
}
export interface VideoItem {
  title: string;
  description: string;
  link: string;
  image: string;
  date: string;
  author: string;
}

export const videos: VideoItem[] = [
  {
    title: "أهمية المشروع الثقافي وضرورة أسبقيته للمسألة السياسية",

    description: "التدابير السياسية وحدها لا تكفي ليخرج السودان من هذه الحفرة، ولكن السودان يحتاج ايضا إلى إصلاح ثقافي",
    link: "ybE4VaA5pqg",
    image: "/video/14.jpg",
    date: "18 ابريل 2024",
    author: "هشام احمد"
  },
  {
    title: "عن أهمية الميثاق الاجتماعي",
    description: "القبيلة والجهة مخزن قسم كريمة ومساحة تربية فاضلة, يحثان على التراحم والتعارف بين الناس",
    link: "mlgqdU_O6Ek",
    image: "/video/15.jpg",
    date: "14 ابريل 2024",
    author: "المقداد الهجان"
  },
  {
    title: "الرؤية الاقتصادية والتنموية للحركة الوطنية",
    description: "في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
    link: "yjSIrCLQL9U",
    image: "/video/16.jpg",
    date: "14 ابريل 2024",
    author: "قاسم الظافر"
  }
];

export const FeaturedVideos = (count: number = 3) => {
  return videos.slice(0, count);
};