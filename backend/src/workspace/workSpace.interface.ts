import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export interface WorkSpace extends Document {
    title: string;
    status?: number
}