import { IsStrongPassword, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyPasswordCustomerDto {
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
