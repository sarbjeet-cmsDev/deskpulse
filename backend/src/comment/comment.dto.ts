import { Transform } from 'class-transformer';
import { IsString, IsMongoId, IsOptional, IsArray } from 'class-validator';
import { Schema as MongooseSchema, Types } from 'mongoose';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsMongoId()
  task: MongooseSchema.Types.ObjectId;

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
