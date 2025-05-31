import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignInAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
