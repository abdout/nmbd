export interface IssueType {
  _id?: string;
  id?: string;
  repository?: string | null;
  repositoryId?: string | null;
  repositoryTitle?: string | null;
  issue?: string;
  club?: string;
  status?: string;
  priority?: string;
  duration?: string;
  desc?: string;
  label?: string;
  tag?: string;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IssueContextProps {
  issue: IssueType | null;
  issues: IssueType[];
  fetchIssue: (id: string) => void;
  fetchIssues: () => void;
  refreshIssues: () => void;
  deleteIssue: (id: string) => void;
  createIssue: (data: IssueType) => void; 
  updateIssue: (id: string, data: Partial<IssueType>) => void; 
}
