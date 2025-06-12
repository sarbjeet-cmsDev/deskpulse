import { Document, Schema as MongooseSchema } from 'mongoose';
export interface Project {
    code: string;
    members: MongooseSchema.Types.ObjectId[];
    notes?: string;
    creds?: string;
    additional_information?: string;
    url_dev?: string;
    url_live?: string;
    url_staging?: string;
    url_uat?: string;
    is_active: boolean;
    sort_order: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ProjectDocument extends Project, Document {
}
