import { IsStrongPassword, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyPasswordAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsStrongPassword()
  @IsNotEmpty()
  confirmPassword: string;
}
