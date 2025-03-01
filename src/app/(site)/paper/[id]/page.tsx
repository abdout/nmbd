import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  params: {
    id: string;
  };
};

// Get the testimonials data - in a real app, this would be in a shared data file
const testimonials = [
  {
    quote:
      "إلى الشعب السوداني الأصيل في ربوع الوطن بمختلف فئاته وانتماءاته إلى الشباب السوداني خاصة المتطلع نحو الوحدة والنهضة والأمن والازدهار, وكريم القيم والأخلاق",
    name: "البيان التأسيسي",
    designation: "الامانة العامة",
    src: "/foundation-declaration.jpg",
  },
  {
    quote:
      "مبدأ الشوري من أسس قيام الدولة ونظام الحكم فيها فلا يفرض مركز سلطة حاكما او امرا على ناحية دون ارادة اهلها بل الوجب أن يختار اهلها سياسة امرهم مما يليهم ومن يحكمهم بالعدل والقسط",
    name: "الميثاق الاجتماعي",
    designation: "امانة المجتمع",
    src: "/social-contract.jpg",
  },
  {
    quote: "مدرسة الاقتصاد التشاركي قريبة من المزاج السوداني في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
    name: "القطاع الزراعي",
    designation: "امانة الزراعة",
    src: "/agriculture.jpg",
  },
  {
    quote:
      "مدرسة الاقتصاد التشاركي قريبة من المزاج السوداني في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
    name: "الاقتصاد التشاركي",
    designation: "الامانة الاقتصادية",
    src: "/sharing-economy.jpg",
  },
  {
    quote:
      "أسبقية الدستور على الدولة، وأن تستمد الدولة مشروعيتها وهيئاتها وأسسها من الدستور  بحيث تكون السُلطة الأعلى هي سُلطة المجتمع النازلة في ميثاق الدستور والموجهة للدولة بمؤسساتها كافة",
    name: "بناء الدولة",
    designation: "الامانة السياسية",
    src: "/state-building.jpg",
  },
];

export async function generateMetadata({ params }: Props) {
  const id = parseInt(params.id) - 1;
  
  if (id < 0 || id >= testimonials.length) {
    return {
      title: 'Paper Not Found',
      description: 'The requested paper could not be found',
    };
  }
  
  const paper = testimonials[id];
  
  return {
    title: `${paper.name} | Public Party`,
    description: paper.quote.substring(0, 160),
  };
}

export default function PaperPage({ params }: Props) {
  const id = parseInt(params.id) - 1;
  
  if (id < 0 || id >= testimonials.length) {
    notFound();
  }
  
  const paper = testimonials[id];
  
  return (
    <div className="container mx-auto py-10 md:px-4 px-0">
      <Link 
        href="/paper"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-6"
        )}
      >
        → الرجوع
      </Link>
      
      <article className="max-w-3xl">
        <div className="relative md:h-80 h-48 w-full md:mb-8 mb-4 rounded-xl overflow-hidden">
          <Image
            src={paper.src}
            alt={paper.name}
            fill
            className="object-cover object-center"
            priority
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
  );
} 