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
import { AcceptanceLevelEnum, PriorityEnum, TaskTypeEnum } from './task.interface';
import { Prop } from '@nestjs/mongoose';



// --- DTOs ---

export class CreateTaskDto {

  @IsOptional()
  @IsString()
  @Prop({ unique: true })
  code: string;

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
  assigned_to?: string;

  @IsOptional()
  @IsMongoId()
  report_to?: string;

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
  status?: any;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;


  @IsOptional()
  @IsNumber()
  estimated_time?: number;

  @IsOptional()
  @IsNumber()
  totaltaskminuts?: number;

  @IsOptional()
  @IsNumber()
  total_timespent?: number;

  @IsOptional()
  created_by?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;
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
  assigned_to?: string;;

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
  status?: any;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;


  @IsOptional()
  @IsNumber()
  estimated_time?: number;

  @IsOptional()
  @IsNumber()
  totaltaskminutes?: number;

  @IsOptional()
  created_by?: MongooseSchema.Types.ObjectId;
  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;
}

export class UpdateTaskStatusUpdateDto {
  // @IsEnum(TaskStatusEnum)
  @IsOptional()
  status: any;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;

  @IsOptional()
  @IsNumber()
  revision?: number; // corrected typo

  @IsOptional()
  @IsNumber()
  totaltaskminutes?: number;
  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;

   @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;
}
