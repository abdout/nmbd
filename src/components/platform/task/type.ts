export type task = {
  _id: string;
  project: string;
  task: string;
  club: string;
  status: string;
  prioity: string;
  duration: string;
  desc: string;
  label: string;
  tag: string;
  remark: string;
};

export interface TaskContextProps {
  task: task | null;
  tasks: task[];
  fetchTask: (id: string) => void;
  fetchTasks: () => void;
  refreshTasks: () => void;
  deleteTask: (id: string) => void;
  createTask: (data: task) => void; 
  updateTask: (id: string, data: Partial<task>) => void; 
}
