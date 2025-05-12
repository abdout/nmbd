"use client";

import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { Metadata } from "next";
import { club as clubList } from '@/components/template/club/constant';

// Metadata generation for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Find the club by id for dynamic metadata
  const clubData = clubList.find(c => c.id === params.id);
  const title = `أمانة ${clubData ? clubData.label : 'غير معروف'}`;
  const description = 'غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون ';

  return {
    title: title,
    description: description,
    openGraph: {
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        },
      ],
    },
  };
}

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  
  useEffect(() => {
    redirect(`/club/${id}/about`);
  }, [id]);
  
  return null;
}