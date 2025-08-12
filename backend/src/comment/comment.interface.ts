import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Comment {
  content: string;
  task: MongooseSchema.Types.ObjectId;
  code:string;
  mentioned?: MongooseSchema.Types.ObjectId[];
  parent_comment?: MongooseSchema.Types.ObjectId[];
  created_by: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDocument extends Comment, Document {}
