import { Metadata } from "next";
import { club as clubList } from '@/components/template/club/constant';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Find the club by id for dynamic metadata
  const clubData = clubList.find(c => c.id === params.id);
  const title = `أمانة ${clubData ? clubData.label : 'غير معروف'}`;
  const description = 'غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون ';

  return {
    title: title,
    description: description,
    openGraph: {
      images: [`/club/${params.id}/opengraph-image`],
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      images: [`/club/${params.id}/opengraph-image`],
      title,
      description,
    },
  };
} 