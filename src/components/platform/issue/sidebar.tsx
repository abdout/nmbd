import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  issue: any;
  participantAvatars: string[];
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

export default function Sidebar({ issue, participantAvatars }: SidebarProps) {
  return (
    <div className="flex flex-col justify-start items-start pt-0">
      <div className="rounded-lg w-full max-w-[250px] select-none hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" className="w-28 h-28 text-foreground"><path fill="currentColor" d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1M2.5 12a9.5 9.5 0 0 0 9.5 9.5a9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5A9.5 9.5 0 0 0 2.5 12m9.5 2a2 2 0 1 1-.001-3.999A2 2 0 0 1 12 14"/></svg>
      </div>
      <div className="flex flex-row flex-wrap gap-2 mt-4 mb-1">
        <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
          {statusArabic[String(issue.status)] ?? 'غير محدد'}
        </span>
        <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
          {priorityArabic[String(issue.priority)] ?? 'غير محدد'}
        </span>
        {issue.repositoryTitle && (
          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
            {issue.repositoryTitle}
          </span>
        )}
        {issue.club && (
          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-sm text-foreground">
            {issue.club}
          </span>
        )}
      </div>
      <div className="mt-8 border-t pt-6 w-full">
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-semibold">الوسوم</h3>
          <span className="mr-2 bg-muted text-muted-foreground rounded-full px-1 py-0 text-[10px]">14</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>figma</Badge>
          <Badge>after effects</Badge>
          <Badge>reactjs</Badge>
          <Badge>vibe coding</Badge>
          <Badge>content creator</Badge>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 w-full">
        <div className="flex items-center mb-2">
          <h3 className="text-sm font-semibold">المشاركين</h3>
          <span className="mr-2 bg-muted text-muted-foreground rounded-full px-1 py-0 text-[10px]">14</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {participantAvatars.map((url, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-muted/50 overflow-hidden border border-muted"
              title={`مشارك ${i + 1}`}
            >
              <img src={url} alt={`مشارك ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <button className="mt-4 text-muted-foreground hover:underline text-sm font-medium">
          +6 مشارك
        </button>
      </div>
    </div>
  );
} 