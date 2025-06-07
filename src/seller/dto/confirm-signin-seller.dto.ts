import { IsNotEmpty, IsEmail } from 'class-validator';

export class ConfirmSignInSellerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  otp: string;
}
