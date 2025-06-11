import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateNotificationDto {
  @IsMongoId()
  user: MongooseSchema.Types.ObjectId;

  @IsString()
  content: string;

  @IsOptional()
  @IsMongoId()
  task?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsMongoId()
  user?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsMongoId()
  task?: MongooseSchema.Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}
