import { Schema as MongooseSchema } from 'mongoose';
export declare class CreateCommentDto {
    content: string;
    task: MongooseSchema.Types.ObjectId;
    mentioned?: MongooseSchema.Types.ObjectId[];
    parent_comment?: MongooseSchema.Types.ObjectId;
    created_by: MongooseSchema.Types.ObjectId;
}
export declare class UpdateCommentDto {
    content?: string;
    mentioned?: MongooseSchema.Types.ObjectId[];
}
