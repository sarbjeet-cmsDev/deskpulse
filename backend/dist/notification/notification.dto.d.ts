import { Schema as MongooseSchema } from 'mongoose';
export declare class CreateNotificationDto {
    user: MongooseSchema.Types.ObjectId;
    content: string;
    is_read?: boolean;
    redirect_url: string;
}
export declare class UpdateNotificationDto {
    is_read?: boolean;
    redirect_url?: string;
}
