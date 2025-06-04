import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { ReportType } from '../../enums/report-type';

export class CreateReportDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsEnum(ReportType)
  @IsNotEmpty()
  report_type: ReportType;

  @IsString()
  @IsNotEmpty()
  data: string;
}
