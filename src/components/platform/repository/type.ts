export interface Repository {
  id: string;
  title: string;
  desc: string;
  club: string;
  status: string;
  readme: string;
  roadmap: string;
  contributor: string;
  material: string;
  chat: string;
  issues: Array<{
    id: string;
    repositoryId: string | null;
    label: string | null;
    desc: string | null;
    club: string | null;
    status: string | null;
    createdAt: Date;
    updatedAt: Date;
    remark: string | null;
  }>;
  updatedAt: string | Date;
  createdAt?: Date;
}

export interface RepositoryContextProps {
  repository: Repository | null;
  repositories: Repository[];
  fetchRepository: (id: string) => void;
  fetchRepositories: () => void;
  refreshRepositories: () => void;
  deleteRepository: (id: string) => void;
}