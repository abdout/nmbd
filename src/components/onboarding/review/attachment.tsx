'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ReviewCardProps } from './type';
import PDFViewer from '@/components/twitter/pdf-viewer';
import { useModal } from '@/components/atom/modal/context';
import Modal from '@/components/atom/modal/modal';

export function AttachmentsCard({ userData }: ReviewCardProps) {
  // Check if there are any attachments
  const hasAttachments = userData?.image || userData?.cv || 
                         userData?.portfolio || userData?.additionalFile;
  
  // State to track which PDF is being viewed
  const [activePdf, setActivePdf] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('document.pdf');

  // Use modal context for image preview
  const { openModal } = useModal();

  // Function to open a PDF document
  const openPdf = (url: string | null | undefined, title: string, fileName: string) => {
    if (url) {
      setActivePdf(url);
      setPdfTitle(title);
      setPdfFileName(fileName);
    }
  };

  // Function to close the PDF viewer
  const closePdf = () => {
    setActivePdf(null);
  };

  // Function to open image in modal
  const openImageModal = () => {
    if (userData?.image) {
      openModal('profile-image');
    }
  };

  // Image preview modal content
  const ImagePreviewContent = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-xl max-h-[80vh] overflow-hidden rounded-lg">
        {userData?.image && (
          <Image 
            src={userData.image} 
            alt="الصورة الشخصية"
            width={600}
            height={600}
            className="w-full h-auto object-contain"
            unoptimized
          />
        )}
      </div>
    </div>
  );
  
  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>المرفقات</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {hasAttachments ? (
            <div className="space-y-4">
              {userData?.image && (
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  onClick={openImageModal}
                >
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
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  onClick={() => openPdf(userData.cv, "السيرة الذاتية", "cv.pdf")}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs">PDF</span>
                  </div>
                  <span className="text-sm">السيرة الذاتية</span>
                </div>
              )}
              {userData?.portfolio && (
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  onClick={() => openPdf(userData.portfolio, "البورتفوليو", "portfolio.pdf")}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs">PDF</span>
                  </div>
                  <span className="text-sm">البورتفوليو</span>
                </div>
              )}
              {userData?.additionalFile && (
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  onClick={() => openPdf(userData.additionalFile, "ملف إضافي", "additionalFile.pdf")}
                >
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
      
      {/* PDF Viewer */}
      <PDFViewer
        isOpen={!!activePdf}
        onClose={closePdf}
        url={activePdf}
        title={pdfTitle}
        fileName={pdfFileName}
      />

      {/* Image Preview Modal */}
      <Modal content={<ImagePreviewContent />} />
    </>
  );
} 