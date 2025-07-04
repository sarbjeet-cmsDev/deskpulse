import { Document, Schema as MongooseSchema } from 'mongoose';

export interface TaskChecklist extends Document {
    title: string;
    status?: 'pending' | 'complete';
    task?: MongooseSchema.Types.ObjectId;  // single task ID
    visibility?: boolean;
    estimate_time?: number;
    sort_order?: number;
    created_by: MongooseSchema.Types.ObjectId;  // user ID
    completed_by?: MongooseSchema.Types.ObjectId;  // user ID
}
