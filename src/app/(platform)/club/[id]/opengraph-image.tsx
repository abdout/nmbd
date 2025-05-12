import { ImageResponse } from 'next/og';
import { club as clubList } from '@/components/template/club/constant';

// Route segment config
export const runtime = 'edge';
export const contentType = 'image/png';

// Image metadata
export const alt = 'Club Details';
export const size = {
  width: 1200,
  height: 630,
};

// Generate Open Graph image
export default async function Image({ params }: { params: { id: string } }) {
  // Find the club by id for dynamic metadata
  const clubData = clubList.find(c => c.id === params.id);
  const title = `أمانة ${clubData ? clubData.label : 'غير معروف'}`;
  const description = 'غنى هاتيك القرى غنى المدائن لحن حب واخاء وتعاون';

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: 24 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, textAlign: 'center', maxWidth: '80%' }}>
          {description}
        </div>
      </div>
    ),
    { ...size }
  );
} 