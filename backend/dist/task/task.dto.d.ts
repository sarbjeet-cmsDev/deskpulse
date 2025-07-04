import { Schema as MongooseSchema } from 'mongoose';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    project?: MongooseSchema.Types.ObjectId;
    sort_order?: number;
    assigned_to?: MongooseSchema.Types.ObjectId;
    report_to?: MongooseSchema.Types.ObjectId;
    due_date?: Date;
    kanban?: MongooseSchema.Types.ObjectId;
    is_active?: boolean;
    priority?: 'low' | 'medium' | 'high';
}
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    project?: MongooseSchema.Types.ObjectId;
    sort_order?: number;
    assigned_to?: MongooseSchema.Types.ObjectId;
    report_to?: MongooseSchema.Types.ObjectId;
    due_date?: Date;
    is_active?: boolean;
    priority?: 'low' | 'medium' | 'high';
}
