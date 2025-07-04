import { IsString, IsOptional, IsDateString, IsEnum, IsMongoId, IsBoolean, IsNumber } from 'class-validator';

export class CreateReminderDto {
    @IsString()
    title: string;

    @IsDateString()
    start: string;

    @IsOptional()
    @IsDateString()
    end?: string;

    @IsOptional()
    @IsEnum(['pending', 'complete'])
    status?: 'pending' | 'complete';

    @IsMongoId()
    user: string;

    @IsOptional()
    @IsBoolean()
    alert?: boolean;

    @IsOptional()
    @IsNumber()
    alert_before?: number;

    @IsOptional()
    @IsNumber()
    sort_order?: number;
}

// Added UpdateReminderDto
export class UpdateReminderDto {
    @IsOptional()
    @IsEnum(['pending', 'complete'])
    status?: 'pending' | 'complete';

    @IsOptional()
    @IsBoolean()
    alert?: boolean;
    
    @IsOptional()
    @IsNumber()
    alert_before?: number;
}