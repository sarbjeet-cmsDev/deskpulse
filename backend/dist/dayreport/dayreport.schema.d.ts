import { Document, Schema as MongooseSchema } from 'mongoose';
export type DayReportDocument = DayReport & Document;
export declare class DayReport {
    user: MongooseSchema.Types.ObjectId;
    tasks: {
        task: MongooseSchema.Types.ObjectId;
        time_spent: number;
        comment?: string;
        blocker?: string;
    }[];
    next_tasks: {
        task: MongooseSchema.Types.ObjectId;
        time_spent: number;
        comment?: string;
        blocker?: string;
    }[];
    comment: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DayReportSchema: MongooseSchema<DayReport, import("mongoose").Model<DayReport, any, any, any, Document<unknown, any, DayReport, any> & DayReport & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DayReport, Document<unknown, {}, import("mongoose").FlatRecord<DayReport>, {}> & import("mongoose").FlatRecord<DayReport> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
