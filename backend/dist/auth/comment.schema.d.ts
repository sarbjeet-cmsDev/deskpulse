import { Document, Schema as MongooseSchema } from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    content: string;
    task: MongooseSchema.Types.ObjectId;
    mentioned: MongooseSchema.Types.ObjectId[];
    parent_comment: MongooseSchema.Types.ObjectId;
    created_by: MongooseSchema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CommentSchema: MongooseSchema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment, any> & Comment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>, {}> & import("mongoose").FlatRecord<Comment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
