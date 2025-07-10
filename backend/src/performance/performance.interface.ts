import { Document, Types } from 'mongoose';

export interface Performance {
    user: Types.ObjectId;          // Correct way to type ObjectId
    task: Types.ObjectId;          // Correct way to type ObjectId
    result: string;
}

export type PerformanceDocument = Performance & Document;
