import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Task extends Document {
  title: string;
  description?: string;
  project: MongooseSchema.Types.ObjectId;
  sort_order: number;
  assigned_to?: MongooseSchema.Types.ObjectId;
  report_to: MongooseSchema.Types.ObjectId;
  due_date?: Date;
  is_active: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'inprogress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
