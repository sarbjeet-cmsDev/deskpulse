import { Document, Schema as MongooseSchema } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare class Notification {
    content: string;
    user: MongooseSchema.Types.ObjectId;
    is_read: boolean;
    redirect_url: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}> & import("mongoose").FlatRecord<Notification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
