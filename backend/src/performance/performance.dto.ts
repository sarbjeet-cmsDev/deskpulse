import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreatePerformanceDto {
  @IsMongoId({ message: 'task must be a valid Mongo ID' })
  @IsNotEmpty({ message: 'task is required' })
  task: MongooseSchema.Types.ObjectId;

  @IsString({ message: 'result must be a string' })
  @IsNotEmpty({ message: 'result is required' })
  result: string;

}

