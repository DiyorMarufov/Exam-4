import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailToRecoverPassAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
