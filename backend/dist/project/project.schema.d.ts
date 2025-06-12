import { Document, Schema as MongooseSchema } from 'mongoose';
export type ProjectDocument = Project & Document;
export declare class Project {
    code: string;
    members: MongooseSchema.Types.ObjectId[];
    project_coordinator: MongooseSchema.Types.ObjectId;
    team_leader: MongooseSchema.Types.ObjectId;
    project_manager: MongooseSchema.Types.ObjectId;
    avatar: string;
    notes: string;
    creds: string;
    additional_information: string;
    url_dev: string;
    url_live: string;
    url_staging: string;
    url_uat: string;
    is_active: boolean;
    sort_order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectSchema: MongooseSchema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any> & Project & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}> & import("mongoose").FlatRecord<Project> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
