import { IsNotEmpty, IsEmail } from 'class-validator';

export class ConfirmSignInCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;
}
