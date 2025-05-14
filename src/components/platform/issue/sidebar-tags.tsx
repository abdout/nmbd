import { Badge } from "@/components/ui/badge";

interface TagsProps {
  tags: string[];
  count: number;
}

export function SidebarTags({ tags, count }: TagsProps) {
  return (
    <div className="mt-8 border-t pt-6 w-full">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-semibold">الوسوم</h3>
        {/* <span className="mr-2 bg-muted text-muted-foreground rounded-full px-1 py-0 text-[10px]">{count}</span> */}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
} 