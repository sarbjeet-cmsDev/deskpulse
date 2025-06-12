import { Schema as MongooseSchema } from 'mongoose';
export declare class CreateNotificationDto {
    user: MongooseSchema.Types.ObjectId;
    content: string;
    task?: MongooseSchema.Types.ObjectId;
    is_read?: boolean;
}
export declare class UpdateNotificationDto {
    user?: MongooseSchema.Types.ObjectId;
    content?: string;
    task?: MongooseSchema.Types.ObjectId;
    is_read?: boolean;
}
