import { Document, Schema as MongooseSchema } from 'mongoose';

export interface Project {
  code: string;
  title: string;
  description?: string;
  users?: MongooseSchema.Types.ObjectId[];
  project_coordinator?: MongooseSchema.Types.ObjectId;
  team_leader?: MongooseSchema.Types.ObjectId;
  project_manager?: MongooseSchema.Types.ObjectId;
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
  report_to?: string;  
  avatar?: string;
  created_by: MongooseSchema.Types.ObjectId;
  updated_by?: MongooseSchema.Types.ObjectId;
}

export interface ProjectDocument extends Project, Document {}
