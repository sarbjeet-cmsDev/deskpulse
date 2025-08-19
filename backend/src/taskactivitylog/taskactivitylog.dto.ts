// taskactivitylog.dto.ts
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskActivityLogDto {
  @IsOptional()
  @IsMongoId({ message: 'Task must be a valid Mongo ID' })
  task?: string;

  @IsString()
  code?: string;

  @IsOptional()
  @IsMongoId({ message: 'Project must be a valid Mongo ID' })
  project?: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}

