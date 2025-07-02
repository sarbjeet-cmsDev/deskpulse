import { Prop } from '@nestjs/mongoose';
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDate, IsMongoId } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateProjectDto {
  @IsString()
  @Prop({ required: true, unique: true })
  code: string;

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
  
}

export class UpdateProjectDto extends CreateProjectDto {}
