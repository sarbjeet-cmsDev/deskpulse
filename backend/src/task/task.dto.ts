import { IsString, IsMongoId, IsOptional, IsNumber, IsBoolean, IsDate, IsEnum } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

 @IsOptional()
  @IsMongoId()
  project?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  @IsMongoId()
  assigned_to?: MongooseSchema.Types.ObjectId;


 @IsOptional()
  @IsMongoId()
  report_to?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsDate()
  due_date?: Date;

  @IsOptional()
  @IsMongoId()
  kanban?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';



}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  project?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  @IsMongoId()
  assigned_to?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  report_to?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsDate()
  due_date?: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}
