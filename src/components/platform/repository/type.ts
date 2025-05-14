export interface Repository {
  id?: string;
  _id?: string;
  title: string;
  desc: string;
  club: string;
  status: string;
  readme: string;
  roadmap: string;
  issue: string;
  contributor: string;
  material: string;
  chat: string;
  updatedAt: string;
}

export interface RepositoryContextProps {
  repository: Repository | null;
  repositories: Repository[];
  fetchRepository: (id: string) => void;
  fetchRepositories: () => void;
  refreshRepositories: () => void;
  deleteRepository: (id: string) => void;
}