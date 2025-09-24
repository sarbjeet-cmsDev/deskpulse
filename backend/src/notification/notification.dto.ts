import { IsString, IsNotEmpty, IsMongoId, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateNotificationDto {
  @IsMongoId({ message: 'User must be a valid Mongo ID' })
  @IsNotEmpty({ message: 'User is required' })
  user: MongooseSchema.Types.ObjectId | string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;


  
  @IsOptional()
  @IsBoolean({ message: 'is_read must be a boolean' })
  is_read?: boolean;

  @IsNotEmpty({ message: 'redirect_url is required' })
  @IsUrl({}, { message: 'redirect_url must be a valid URL' })
  redirect_url: string;
}


export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean({ message: 'is_read must be a boolean' })
  is_read?: boolean;

  @IsOptional()
  @IsUrl({}, { message: 'redirect_url must be a valid URL' })
  redirect_url?: string;
}

