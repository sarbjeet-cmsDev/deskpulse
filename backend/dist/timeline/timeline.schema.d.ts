import { Document, Schema as MongooseSchema } from 'mongoose';
export type TimelineDocument = Timeline & Document;
export declare class Timeline {
    task: MongooseSchema.Types.ObjectId;
    user: MongooseSchema.Types.ObjectId;
    date: Date;
    time_spent: string;
    is_active: boolean;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TimelineSchema: MongooseSchema<Timeline, import("mongoose").Model<Timeline, any, any, any, Document<unknown, any, Timeline, any> & Timeline & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Timeline, Document<unknown, {}, import("mongoose").FlatRecord<Timeline>, {}> & import("mongoose").FlatRecord<Timeline> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
