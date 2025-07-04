import { Document, Schema as MongooseSchema } from 'mongoose';
export interface Project {
    code: string;
    users: MongooseSchema.Types.ObjectId[];
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
    project?: string;
    report_to?: string;
}
export interface ProjectDocument extends Project, Document {
}
