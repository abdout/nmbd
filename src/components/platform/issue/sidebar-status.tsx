interface StatusProps {
  repositoryTitle?: string;
  club?: string;
  status: string;
  priority: string;
}

const statusArabic: Record<string, string> = {
  pending: 'محايد',
  stuck: 'متوقف',
  in_progress: 'جاري',
  done: 'تم',
};

const priorityArabic: Record<string, string> = {
  pending: 'محايد',
  high: 'عالي',
  medium: 'متوسط',
  low: 'منخفض',
};

export function SidebarStatus({ repositoryTitle, club, status, priority }: StatusProps) {
  return (
    <div className="flex flex-row flex-wrap gap-2 mt-4 mb-1">
      {repositoryTitle && (
        <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
          {repositoryTitle}
        </span>
      )}
      {club && (
        <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
          {club}
        </span>
      )}
      <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
        {statusArabic[String(status)] ?? 'غير محدد'}
      </span>
      <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
        {priorityArabic[String(priority)] ?? 'غير محدد'}
      </span>
    </div>
  );
} 