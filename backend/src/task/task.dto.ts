import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { AcceptanceLevelEnum, PriorityEnum, TaskStatusEnum, TaskTypeEnum } from './task.interface';



// --- DTOs ---

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskTypeEnum)
  @IsOptional()
  type: TaskTypeEnum;

  @IsOptional()
  @IsMongoId()
  project?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
  assigned_to?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
  report_to?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  kanban?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  due_date?: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;


  @IsOptional()
  @IsNumber()
  estimated_time?: number;

  @IsOptional()
  @IsNumber()
  totaltaskminuts?: number;


}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskTypeEnum)
  type?: TaskTypeEnum;

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
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
  report_to?: MongooseSchema.Types.ObjectId;


  @IsOptional()
  @IsMongoId()
  kanban?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  due_date?: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;


  @IsOptional()
  @IsNumber()
  estimated_time?: number;

  @IsOptional()
  @IsNumber()
  totaltaskminuts?: number;

}

export class UpdateTaskStatusUpdateDto {
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;

  @IsOptional()
  @IsNumber()
  revision?: number; // corrected typo

  @IsOptional()
  @IsNumber()
  totaltaskminuts?: number;
}
