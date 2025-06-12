import { Schema as MongooseSchema } from 'mongoose';
export declare class CreateTimelineDto {
    task: MongooseSchema.Types.ObjectId;
    date?: Date;
    user?: MongooseSchema.Types.ObjectId;
    time_spent?: string;
    comments?: string;
    is_active?: boolean;
}
export declare class UpdateTimelineDto {
    task: MongooseSchema.Types.ObjectId;
    date?: Date;
    user?: MongooseSchema.Types.ObjectId;
    description?: string;
    time_spent?: string;
    is_active?: boolean;
}
