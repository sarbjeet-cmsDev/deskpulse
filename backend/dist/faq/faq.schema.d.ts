import * as mongoose from 'mongoose';
declare const FaqSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    title: string;
    content: string;
    sort_order: string;
    category: "terms" | "payment" | "contact" | "help" | "support";
    videoUrl?: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    title: string;
    content: string;
    sort_order: string;
    category: "terms" | "payment" | "contact" | "help" | "support";
    videoUrl?: string;
}>, {}> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    title: string;
    content: string;
    sort_order: string;
    category: "terms" | "payment" | "contact" | "help" | "support";
    videoUrl?: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default FaqSchema;
