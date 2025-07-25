import { Prop } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsMongoId,
} from "class-validator";
import { Schema as MongooseSchema, Types } from "mongoose";

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  @Prop({ required: true, unique: true })
  code: string;

  @IsOptional()
  @IsString()
  @Prop({ required: false })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  deploy_instruction?: string;

  @IsOptional()
  @IsString()
  critical_notes?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  users?: MongooseSchema.Types.ObjectId[];

  @IsOptional()
  @IsString()
  project_coordinator?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
  team_leader?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
  project_manager?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
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

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;

  @IsNumber()
  @IsOptional()
  sort_order?: number;

  @IsOptional()
  created_by?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;
}

export class UpdateProjectDto extends CreateProjectDto {}
