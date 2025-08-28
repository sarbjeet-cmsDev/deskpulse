
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

/**
 * ✅ CreateKanbanDto
 * All fields required when creating a kanban column
 */
export class CreateKanbanDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  sort_order: number;

  @IsMongoId()
  @IsNotEmpty()
  project: string;

  @IsOptional()
  color: string;
}

/**
 * ✅ UpdateKanbanDto
 * All fields optional when updating a column
 */
export class UpdateKanbanDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  color?: string;
}
