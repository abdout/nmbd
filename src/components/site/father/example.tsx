"use client";


import Head from "@/components/atom/site-heading";
import { Carousel } from "./display";


export function CarouselDemo() {
  const slideData = [
    {
      title: "طه عبد الرحمن",
      button: "عرض المكتبة",
      src: "/father/taha.webp",
    },

    {
      title: "علي شريعتي",
      button: "عرض المكتبة",
      src: "/father/ali.jpg",
    },


    {
      title: "عبد الوهاب المسيري",
      button: "عرض المكتبة",
      src: "/father/almisery.jpg",
    },
    {
      title: "حسن الترابي",
      button: "عرض المكتبة",
      src: "/father/altrabi.jpg",
    },

    {
        title: "مالك بن نبي",
        button: "عرض المكتبة",
        src: "/father/malek.jpg",
      },

      {
        title: "سيد قطب",
        button: "عرض المكتبة",
        src: "/father/sayid.webp",
      },
      {
        title: "ابو القاسم حاج حمد",
        button: "عرض المكتبة",
        src: "/father/hamed.webp",
      },
      {
        title: "ابن رشد",
        button: "عرض المكتبة",
        src: "/father/abn-rshd.jpg",
      },

      {
        title: "محمد عمارة",
        button: "عرض المكتبة",
        src: "/father/amara.jpg",
      },


  ];
  return (
    <div 
      dir="ltr"
      className="relative overflow-hidden w-full h-full py-20 -mt-14 mb-8">
     <Head title= "الاباء" description="مفكري الحركة" />
      <Carousel slides={slideData} />
    </div>

  );
}
