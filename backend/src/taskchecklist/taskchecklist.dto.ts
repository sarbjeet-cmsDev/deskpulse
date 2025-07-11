import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Schema as MongooseSchema, Types } from 'mongoose';

// ----------- CREATE DTO -----------
export class CreateTaskChecklistDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsEnum(['pending', 'complete'], {
    message: 'Status must be either "pending" or "complete"',
  })
  status: 'pending' | 'complete';

  @IsMongoId({ message: 'Task must be a valid Mongo ID' })
  task: string;

  @IsOptional()
    @Transform(({ value }) => (value ? new Types.ObjectId(value) : undefined))
  @IsMongoId()
  
  created_by: MongooseSchema.Types.ObjectId;
  
  @IsOptional()
  @IsMongoId({ message: 'Completed by must be a valid Mongo ID' })
  completed_by: string;

  @IsBoolean({ message: 'Visibility must be a boolean value' })
  visibility: boolean;
  
  @IsOptional()
  @IsNumber({}, { message: 'Estimate time must be a number' })
  estimate_time: number;
}


// ----------- UPDATE DTO -----------
export class UpdateTaskChecklistDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsEnum(['pending', 'complete'], {
    message: 'Status must be either "pending" or "complete"',
  })
  status?: 'pending' | 'complete';

  @IsOptional()
  @IsMongoId({ message: 'Completed by must be a valid Mongo ID' })
  completed_by?: string;

  @IsOptional()
  @IsBoolean({ message: 'Visibility must be a boolean value' })
  visibility?: boolean;
}
