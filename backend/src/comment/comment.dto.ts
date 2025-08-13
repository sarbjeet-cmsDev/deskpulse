import { Transform } from 'class-transformer';
import { IsString, IsMongoId, IsOptional, IsArray } from 'class-validator';
import { Schema as MongooseSchema, Types } from 'mongoose';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsMongoId()
  project: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  task: MongooseSchema.Types.ObjectId;

  @IsString()
  code: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentioned?: any;

  @IsOptional()
  @IsMongoId({ each: true })
  parent_comment?: MongooseSchema.Types.ObjectId[];


  @IsOptional()
  @IsMongoId()
  created_by: string;
}

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentioned?: MongooseSchema.Types.ObjectId[];
}
