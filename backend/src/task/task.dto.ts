import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsMongoId,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { AcceptanceLevelEnum, PriorityEnum, ClientAcceptance, TaskTypeEnum } from './task.interface';
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
  // @IsNumber()
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
  @IsEnum(ClientAcceptance)
  client_acceptance?: ClientAcceptance;

  @IsOptional()
  status?: any;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;


  @IsOptional()
  // @IsNumber()
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

  @IsOptional()
  isArchived?: Boolean
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
  // @IsDate()
  // @Type(() => Date)
  due_date?: Date;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;

  @IsOptional()
  @IsEnum(ClientAcceptance)
  client_acceptance?: ClientAcceptance;

  @IsOptional()
  status?: any;

  @IsOptional()
  @IsEnum(AcceptanceLevelEnum)
  acceptance?: AcceptanceLevelEnum;


  @IsOptional()
  // @IsNumber()
  estimated_time?: number;

  @IsOptional()
  @IsNumber()
  totaltaskminutes?: number;

  @IsOptional()
  created_by?: MongooseSchema.Types.ObjectId;
  @IsOptional()
  updated_by?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  isArchived?: Boolean
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
  @IsEnum(ClientAcceptance)
  client_acceptance?: ClientAcceptance;

  @IsOptional()
  @IsEnum(PriorityEnum)
  priority?: PriorityEnum;

  @IsOptional()
  @IsEnum(TaskTypeEnum)
  type?: TaskTypeEnum;

  @IsOptional()
  isArchived?: Boolean

  @IsOptional()
  startDate?:Date

   @IsOptional()
  endDate?:Date

}

// DTO
class TaskSortItemDto {
  @IsString()
  _id: string;

  @IsNumber()
  @Min(0)
  sort_order: number;
}

export class UpdateTasktKanbanOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskSortItemDto)
  data: TaskSortItemDto[];
}
