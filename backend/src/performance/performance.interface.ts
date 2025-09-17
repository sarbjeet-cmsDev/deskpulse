import { Document, Types } from 'mongoose';

export interface Performance {
    task: Types.ObjectId;
    result: string;
}

export type PerformanceDocument = Performance & Document;
