'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import OptimizedImage from '@/components/image/optimum-image';

// Local loading component
const PaperLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

// Get the testimonials data - in a real app, this would be in a shared data file
const testimonials = [
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

export default function PaperPage() {
  const params = useParams();
  const [paper, setPaper] = useState<typeof testimonials[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPaper = async () => {
      setIsLoading(true);
      
    if (!params.id) return;
    
    const idString = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
    const id = parseInt(idString) - 1;
    
    if (isNaN(id) || id < 0 || id >= testimonials.length) {
      notFound();
      return;
    }
      
      // Simulate a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
    
    setPaper(testimonials[id]);
      setIsLoading(false);
    };
    
    fetchPaper();
  }, [params.id]);
  
  if (isLoading) {
    return <PaperLoading />;
  }
  
  if (!paper) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto py-10 md:px-4 px-0">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/paper"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6"
          )}
        >
          → الرجوع
        </Link>
        
        <article>
          <div className="relative md:h-80 h-48 w-full md:mb-8 mb-4 rounded-xl overflow-hidden">
            <OptimizedImage
              src={paper.src}
              alt={paper.name}
              fill
              className="object-cover object-center"
              priority
              transformations={[
                { quality: 80 },
                { format: "auto" }
              ]}
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          
          <header className="mb-8 text-right">
            <h1 className="text-3xl font-bold mb-2">{paper.name}</h1>
            <p className="text-gray-600">{paper.designation}</p>
          </header>
          
          <div className="bg-gray-100 dark:bg-neutral-900 md:p-6 p-4 rounded-lg md:mb-6 mb-4 rtl">
            <p className="text-lg leading-relaxed text-right">{paper.quote}</p>
          </div>
          
          <div className="prose max-w-none rtl">
            <p className="text-right">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
            </p>
            <p className="text-right">
              إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
} 