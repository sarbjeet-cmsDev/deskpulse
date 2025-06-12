import { Document, Schema as MongooseSchema } from 'mongoose';
export type TaskDocument = Task & Document;
export declare class Task {
    title: string;
    description: string;
    project: MongooseSchema.Types.ObjectId;
    sort_order: number;
    assigned_to: MongooseSchema.Types.ObjectId;
    report_to: MongooseSchema.Types.ObjectId;
    due_date: Date;
    is_active: boolean;
    priority: string;
    estimated_time: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TaskSchema: MongooseSchema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task, any> & Task & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>, {}> & import("mongoose").FlatRecord<Task> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
