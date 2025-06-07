import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../../enums';

export class StatusAdminDto {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
