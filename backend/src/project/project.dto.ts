import { Prop } from '@nestjs/mongoose';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsMongoId
} from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export enum ProjectStatus {
  Draft = 0,
  Active = 1,
  Inactive = 2,
}

export class CreateProjectDto {
  @IsString()
  @Prop({ required: true, unique: true })
  code: string;

  @IsString()
  @Prop({ required: true })
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  users?: MongooseSchema.Types.ObjectId[];

  @IsMongoId()
  @IsOptional()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  project_coordinator?: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  project_manager?: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  team_leader?: MongooseSchema.Types.ObjectId;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  creds?: string;

  @IsString()
  @IsOptional()
  additional_information?: string;

  @IsString()
  @IsOptional()
  url_dev?: string;

  @IsString()
  @IsOptional()
  url_live?: string;

  @IsString()
  @IsOptional()
  url_staging?: string;

  @IsString()
  @IsOptional()
  url_uat?: string;

  @IsBoolean()
  @Prop({ default: false })
  is_active?: boolean;

  @IsNumber()
  @IsOptional()
  sort_order?: number;

  created_by?: MongooseSchema.Types.ObjectId;

  
  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;
}


export class UpdateProjectDto {

  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  users?: MongooseSchema.Types.ObjectId[];


  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  creds?: string;

  @IsString()
  @IsOptional()
  additional_information?: string;

  @IsString()
  @IsOptional()
  url_dev?: string;

  @IsString()
  @IsOptional()
  url_live?: string;

  @IsString()
  @IsOptional()
  url_staging?: string;

  @IsString()
  @IsOptional()
  url_uat?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsNumber()
  @IsOptional()
  sort_order?: number;
  
  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;
}

