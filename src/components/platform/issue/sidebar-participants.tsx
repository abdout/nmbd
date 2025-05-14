interface ParticipantsProps {
  avatars: string[];
  count: number;
  extraCount: number;
}

export function SidebarParticipants({ avatars, count, extraCount }: ParticipantsProps) {
  return (
    <div className="mt-8 border-t pt-6 w-full">
      <div className="flex items-center mb-2">
        <h3 className="text-sm font-semibold">المشاركين</h3>
        <span className="mr-2 bg-muted text-muted-foreground rounded-full px-1 py-0 text-[10px]">{count}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {avatars.map((url, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-muted/50 overflow-hidden border border-muted"
            title={`مشارك ${i + 1}`}
          >
            <img src={url} alt={`مشارك ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      {extraCount > 0 && (
        <button className="mt-4 text-muted-foreground hover:underline text-sm font-medium">
          +{extraCount} مشارك
        </button>
      )}
    </div>
  );
} 