import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from "@/components/atom/site-heading";

export const metadata = {
  title: 'الاوراق',
  description: 'برامج وتوجهات الحركة',
};

export default function AllPapersPage() {
  // Using the testimonials array from AnimatedTestimonialsDemo
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

  return (
    <div className="container mx-auto px-4">
      <Head title="الاوراق" description="" align="start" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((paper, index) => (
          <Link 
            key={index} 
            href={`/paper/${index + 1}`}
            className="group flex flex-col rounded-lg overflow-hidden  transition duration-300"
          >
            <div className="relative h-[13rem] w-full overflow-hidden">
              <Image
                src={paper.src}
                alt={paper.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-4 bg-neutral-100">
              <h2 className="text-xl font-bold mb-1 text-right">{paper.name}</h2>
              <p className="text-gray-600 text-sm text-right">{paper.designation}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 