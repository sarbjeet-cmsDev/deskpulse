export interface ITaskChecklist {
  _id: string;
  title: string;
  status: 'pending' | 'complete';
  task: string;
  created_by: string;
  completed_by: string;
  visibility: boolean;
  estimate_time: number;
  createdAt?: string;
  updatedAt?: string;
}