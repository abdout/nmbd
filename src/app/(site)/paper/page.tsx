'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from "@/components/atom/site-heading";
import OptimizedImage from '@/components/image/optimum-image';

// Local loading component
const PapersLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

// Define the paper type
interface PaperItem {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

// Move metadata out of client component
export default function AllPapersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [papers, setPapers] = useState<PaperItem[]>([]);
  
  // Using the testimonials array from AnimatedTestimonialsDemo
  const testimonials: PaperItem[] = [
    {
      quote:
        "إلى الشعب السوداني الأصيل في ربوع الوطن بمختلف فئاته وانتماءاته إلى الشباب السوداني خاصة المتطلع نحو الوحدة والنهضة والأمن والازدهار, وكريم القيم والأخلاق",
      name: "البيان التأسيسي",
      designation: "الامانة العامة",
      src: "/paper/foundation-declaration.jpg",
    },
    {
      quote:
        "مبدأ الشوري من أسس قيام الدولة ونظام الحكم فيها فلا يفرض مركز سلطة حاكما او امرا على ناحية دون ارادة اهلها بل الوجب أن يختار اهلها سياسة امرهم مما يليهم ومن يحكمهم بالعدل والقسط",
      name: "الميثاق الاجتماعي",
      designation: "امانة المجتمع",
      src: "/paper/social-contract.jpg",
    },
    {
      quote: "مدرسة الاقتصاد التشاركي قريبة من المزاج السوداني في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
      name: "القطاع الزراعي",
      designation: "امانة الزراعة",
      src: "/paper/agriculture.jpg",
    },
    {
      quote:
        "مدرسة الاقتصاد التشاركي قريبة من المزاج السوداني في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
      name: "الاقتصاد التشاركي",
      designation: "الامانة الاقتصادية",
      src: "/paper/sharing-economy.jpg",
    },
    {
      quote:
        "أسبقية الدستور على الدولة، وأن تستمد الدولة مشروعيتها وهيئاتها وأسسها من الدستور  بحيث تكون السُلطة الأعلى هي سُلطة المجتمع النازلة في ميثاق الدستور والموجهة للدولة بمؤسساتها كافة",
      name: "بناء الدولة",
      designation: "الامانة السياسية",
      src: "/paper/build.webp",
    },
  ];

  useEffect(() => {
    const loadPapers = async () => {
      setIsLoading(true);
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPapers(testimonials);
      setIsLoading(false);
    };
    
    loadPapers();
  }, []);

  if (isLoading) {
    return <PapersLoading />;
  }

  return (
    <div className="container mx-auto md:px-4 px-0">
      <Head title="الاوراق" description="" align="start" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((paper, index) => (
          <Link 
            key={index} 
            href={`/paper/${index + 1}`}
            className="group flex flex-col rounded-lg overflow-hidden  transition duration-300"
          >
            <div className="relative md:h-[13rem] h-[11rem] w-full overflow-hidden">
              <OptimizedImage
                src={paper.src}
                alt={paper.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition duration-300"
                transformations={[
                  { quality: 80 },
                  { format: "auto" }
                ]}
                objectFit="cover"
                objectPosition="center"
              />
            </div>
            <div className="md:p-4 px-4 py-3  bg-neutral-100 dark:bg-neutral-900">
              <h2 className="text-xl font-bold mb-1 text-right ">{paper.name}</h2>
              <p className="text-muted-foreground text-sm text-right">{paper.designation}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 