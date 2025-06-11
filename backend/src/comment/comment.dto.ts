import { IsString, IsMongoId, IsOptional, IsArray } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsMongoId()
  task: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentioned?: MongooseSchema.Types.ObjectId[];

  @IsOptional()
  @IsMongoId()
  parent_comment?: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  created_by: MongooseSchema.Types.ObjectId;
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
