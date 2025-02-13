export type task = {
  _id: string;
  project: String;
  task: String;
  club: String;
  status: String;
  prioity: String;
  duration: String;
  desc: String;
  label: String;
  tag: String;
  remark: String;
};

export interface TaskContextProps {
  task: task | null;
  tasks: task [];
  fetchTask: (id: string) => void;
  fetchTasks: () => void;
  refreshTasks: () => void;
  deleteTask: (id: string) => void;
  createTask: (data: task) => void; 
  updateTask: (id: string, data: Partial<task>) => void; 
}
