import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteIssue } from "./action";
import { toast } from "sonner";

interface ActionsProps {
  issueId: string;
}

export function SidebarActions({ issueId }: ActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/issue/${issueId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذه المشكلة؟')) {
      const result = await deleteIssue(issueId);
      if (result.success) {
        toast.success('تم حذف المشكلة بنجاح');
        router.push('/issue');
      } else {
        toast.error(result.error || 'حدث خطأ أثناء حذف المشكلة');
      }
    }
  };

  return (
    <div className="mt-8 border-t pt-6 w-full">
      <div className="flex flex-row gap-2 w-full">
        <Button
          onClick={handleEdit}
          variant="outline"
          className="flex-1 justify-center md:justify-start gap-2"
          title="تعديل المشكلة"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden md:inline">تعديل</span>
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="flex-1 justify-center md:justify-start gap-2"
          title="حذف المشكلة"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden md:inline">حذف</span>
        </Button>
      </div>
    </div>
  );
} 