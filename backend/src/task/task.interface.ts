import { Document, Schema as MongooseSchema } from 'mongoose';

// --- Reusable Enums ---
export enum TaskTypeEnum {
  UI_UX = 'ui/ux',
  BACKEND = 'backend',
  UI_UX_BUG = 'ui/ux bug',
  BACKEND_BUG = 'backend bug',
  DEVOPS = 'DevOps',
  QA = 'QA',
  RND = 'R&D',
}

export enum AcceptanceLevelEnum {
  AVERAGE = 'Average',
  GOOD = 'Good',
  SATISFIED = 'Satisfied',
  VERY_SATISFIED = 'Very Satisfied',
  EXCELLENT = 'Excellent',
}

export enum PriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatusEnum {
  PENDING = 'pending',
  IN_PROGRESS = 'inprogress',
  COMPLETED = 'completed',
  TODO = 'todo',
  BACKLOG = 'backlog',
  PROGRESS = 'progress',
  CODE_REVIEW = 'code_review',
  QA = 'qa',
  TO_DEPLOY = 'todeploy',
  DONE = 'done',
}


export interface Task extends Document {
  title: string;
  description?: string;
  type: TaskTypeEnum;
  project: MongooseSchema.Types.ObjectId;
  sort_order: number;
  assigned_to?: MongooseSchema.Types.ObjectId;
  report_to: MongooseSchema.Types.ObjectId;
  due_date?: Date;
  is_active: boolean;
  priority: PriorityEnum;
  status: TaskStatusEnum;
  acceptance?: AcceptanceLevelEnum;
  createdAt: Date;
  rivision: number;
  updatedAt: Date;
}
