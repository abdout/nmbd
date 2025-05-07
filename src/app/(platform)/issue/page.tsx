import { getIssues } from '@/components/platform/issue/action';
import { Content } from '@/components/platform/issue/content';

export default async function IssuePage() {
  const { issues } = await getIssues();
  return <Content initialIssues={(issues ?? []).map(issue => ({ 
    ...issue, 
    _id: issue.id,
    repository: issue.repository?.id || null,
    repositoryTitle: issue.repositoryTitle || issue.repository?.title || null
  }))} />;
}