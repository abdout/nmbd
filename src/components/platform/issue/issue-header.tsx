interface IssueHeaderProps {
  issue: { issue: string; desc?: string };
}

export default function IssueHeader({ issue }: IssueHeaderProps) {
  return (
    <>
      <h2 className="font-heading">{issue.issue}</h2>
      {issue.desc && (
        <p className="md:w-[80%] text-muted-foreground text-lg">{issue.desc}</p>
      )}
    </>
  );
} 