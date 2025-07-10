export interface Task {
  title: string;
  _id: string;
  project: string;
  report_to: string;
  status?: string;
}
