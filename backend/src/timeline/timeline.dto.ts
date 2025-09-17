import { IsString, IsMongoId, IsOptional, IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateTimelineDto {
    @IsMongoId()
    @IsNotEmpty({ message: 'Task is required.' })
    task: MongooseSchema.Types.ObjectId;

    @IsNotEmpty({ message: 'Date is required.' })

    @IsNotEmpty({ message: 'Date is required.' })
    @Type(() => Date)
    @IsDate({ message: 'Date must be a valid Date instance.' })
    date: Date;

    @IsOptional()
    @IsMongoId()
    user?: string;

    @IsNotEmpty({ message: 'Time spent is required.' })
    time_spent?: number;

    @IsOptional()
    @IsString({ each: false })
    comment?: string;


    @IsBoolean()
    @IsOptional()
    is_active?: boolean;


    @IsOptional()
    created_by?: MongooseSchema.Types.ObjectId;

    @IsOptional()
    updated_by?: MongooseSchema.Types.ObjectId;
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


    @IsNotEmpty()
    time_spent?: string; 

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsOptional()
    updated_by?: MongooseSchema.Types.ObjectId;
}
