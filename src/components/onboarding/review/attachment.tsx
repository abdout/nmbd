import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ReviewCardProps } from './type';

// Helper function to convert PDF URL to preview URL
const _getPdfPreviewUrl = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Always use /upload/ path and ensure PDF extension is removed
  url = url.replace('/raw/upload/', '/upload/').replace('.pdf', '');
  
  // Extract the base URL and file path
  const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);
  const filePath = url.substring(url.indexOf('/upload/') + 8);
  
  // Generate preview URL with transformation
  return `${baseUrl}q_auto,f_jpg,pg_1/${filePath}`;
};

export function AttachmentsCard({ userData }: ReviewCardProps) {
  // Check if there are any attachments
  const hasAttachments = userData?.image || userData?.cv || 
                         userData?.portfolio || userData?.additionalFile;
  
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>المرفقات</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {hasAttachments ? (
          <div className="space-y-4">
            {userData?.image && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src={userData.image} 
                    alt="الصورة الشخصية" 
                    width={40} 
                    height={40} 
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
                <span className="text-sm">الصورة الشخصية</span>
              </div>
            )}
            {userData?.cv && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">السيرة الذاتية</span>
              </div>
            )}
            {userData?.portfolio && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">البورتفوليو</span>
              </div>
            )}
            {userData?.additionalFile && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs">PDF</span>
                </div>
                <span className="text-sm">ملف إضافي</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">لا توجد مرفقات</p>
        )}
      </CardContent>
    </Card>
  );
} 