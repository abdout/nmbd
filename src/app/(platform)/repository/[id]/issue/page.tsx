import { getIssues } from '@/components/platform/issue/action';
import { Content } from '@/components/platform/issue/content';
import Loading from '@/components/atom/loading';
import { Suspense } from 'react';

export default function IssuePage() {
  return (
    <Suspense fallback={<Loading />}>
      <IssuePageContent />
    </Suspense>
  );
}

async function IssuePageContent() {
  const { issues } = await getIssues();
  return <Content initialIssues={(issues ?? []).map(issue => ({ 
    ...issue, 
    _id: issue.id,
    repository: issue.repository?.id || '',
    repositoryTitle: issue.repositoryTitle || issue.repository?.title || '',
    issue: issue.issue || '',
    club: issue.club || '',
    status: issue.status || '',
    priority: issue.priority || '',
    duration: issue.duration || '',
    desc: issue.desc || '',
    label: issue.label || '',
    tag: issue.tag || '',
    remark: issue.remark || ''
  }))} />;
}