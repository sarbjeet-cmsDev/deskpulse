import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FaqDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  sort_order: string;

  @IsEnum(['terms', 'payment', 'contact', 'help', 'support'])
  category: 'terms' | 'payment' | 'contact' | 'help' | 'support';

  @IsString()
  @IsOptional()
  videoUrl?: string;
}
