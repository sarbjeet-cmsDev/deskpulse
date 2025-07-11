import { Prop } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Schema as MongooseSchema, Types } from 'mongoose';

export class CreateProjectDto {
  @IsString()
  @Prop({ required: true, unique: true })
  code: string;

  @IsOptional()
  @IsString()
  @Prop({ required: false })
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  users?: MongooseSchema.Types.ObjectId[];

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
  project_coordinator?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
  project_manager?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
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

  @IsOptional()
  created_by?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;
}

export class UpdateProjectDto extends CreateProjectDto {}