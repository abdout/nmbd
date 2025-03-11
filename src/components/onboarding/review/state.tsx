import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewDialogProps } from './type';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
    </div>
  );
}

type ErrorStateProps = {
  error: string;
};

export function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();
  
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">حدث خطأ</h1>
      <p className="text-red-500 mb-4">{error}</p>
      <Button onClick={() => router.push('/onboarding')}>
        العودة إلى التسجيل
      </Button>
    </div>
  );
}

export function SuccessDialog({ showDialog, setShowDialog, onClose }: ReviewDialogProps) {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-center text-4xl">تم</DialogTitle>
          <DialogDescription className="text-center pt-4">
            شكراً. سيتم مراجعة طلبك خلال 7 أيام.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button onClick={onClose}>
            الصفحة الرئيسية
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 