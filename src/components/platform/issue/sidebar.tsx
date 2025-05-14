'use client';

import { SidebarStatus } from './sidebar-status';
import { SidebarTags } from './sidebar-tags';
import { SidebarParticipants } from './sidebar-participants';
import { SidebarActions } from './sidebar-actions';

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

      <SidebarStatus 
        repositoryTitle={issue.repositoryTitle}
        club={issue.club}
        status={issue.status}
        priority={issue.priority}
      />

      <SidebarTags 
        tags={['figma', 'after effects', 'reactjs', 'vibe coding', 'content creator']}
        count={14}
      />

      <SidebarParticipants 
        avatars={participantAvatars}
        count={14}
        extraCount={6}
      />

      <SidebarActions 
        issueId={issue.id}
      />
    </div>
  );
} 