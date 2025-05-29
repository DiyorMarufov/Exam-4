import { IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';

export class SignInAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
