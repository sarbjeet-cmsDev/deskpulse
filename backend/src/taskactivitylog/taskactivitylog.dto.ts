// taskactivitylog.dto.ts
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskActivityLogDto {
  @IsMongoId({ message: 'Task must be a valid Mongo ID' })
  task: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
