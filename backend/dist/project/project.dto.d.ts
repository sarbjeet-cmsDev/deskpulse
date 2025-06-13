import { Schema as MongooseSchema } from 'mongoose';
export declare class CreateProjectDto {
    code: string;
    users?: MongooseSchema.Types.ObjectId[];
    notes?: string;
    creds?: string;
    additional_information?: string;
    url_dev?: string;
    url_live?: string;
    url_staging?: string;
    url_uat?: string;
    is_active?: boolean;
    sort_order?: number;
}
export declare class UpdateProjectDto extends CreateProjectDto {
}
