import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Timeline extends Document {
    task: MongooseSchema.Types.ObjectId;
    date?: Date;
    user?: MongooseSchema.Types.ObjectId;
    time_spent?:number;
    comments?: string;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
