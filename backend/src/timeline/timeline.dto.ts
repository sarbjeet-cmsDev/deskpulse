import { IsString, IsMongoId, IsOptional, IsNumber, IsBoolean, IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateTimelineDto {
    @IsMongoId()
    @IsNotEmpty({ message: 'Task is required.' })
    task: MongooseSchema.Types.ObjectId;
    
    @IsNotEmpty({ message: 'Date is required.' })
    
    @IsDate()
    date?: Date;

    @IsMongoId()
    @IsNotEmpty({ message: 'User is required.' })
    user?: MongooseSchema.Types.ObjectId;

    @IsString()
    @IsNotEmpty({ message: 'Time spent is required.' })
    time_spent?: string; // Time spent in hours

    @IsOptional()
    @IsString({ each: false })
    comments?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class UpdateTimelineDto {
    @IsMongoId()
    task: MongooseSchema.Types.ObjectId;

    @IsDate()
    date?: Date;

    @IsMongoId()
    user?: MongooseSchema.Types.ObjectId;

    @IsOptional()
    @IsString()
    description?: string;


    @IsString()
    @IsNotEmpty()
    time_spent?: string; // Time spent in hours
    
    @IsBoolean()
    is_active?: boolean;
}
