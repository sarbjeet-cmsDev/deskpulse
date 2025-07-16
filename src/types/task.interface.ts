export interface Task {
  title: string;
  _id: string;
  project: string;
  report_to: string;
  status?: string;
}

export enum TaskStatusEnum {
  // PENDING = 'pending',
  IN_PROGRESS = 'inprogress',
  // COMPLETED = 'completed',
  TODO = 'todo',
  BACKLOG = 'backlog',
  PROGRESS = 'progress',
  CODE_REVIEW = 'code_review',
  QA = 'qa',
  TO_DEPLOY = 'todeploy',
  DONE = 'done',
}