import { Document, Schema as MongooseSchema } from 'mongoose';

export interface TaskChecklist extends Document {
    task?: MongooseSchema.Types.ObjectId;  // single task ID
    description: string;
}

export interface TaskStatusUpdatedPayload {
  taskDetails: any;
  userDetails: any;
  projectObj:any;
  code:string;
  oldTaskStatus: string;
  newTaskStatus: string;
}