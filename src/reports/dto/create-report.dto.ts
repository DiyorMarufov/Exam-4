import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @IsOptional()
  user_id: number;

  @IsEnum(['bug', 'feature', 'feedback', 'abuse', 'other'])
  @IsNotEmpty()
  report_type: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}
