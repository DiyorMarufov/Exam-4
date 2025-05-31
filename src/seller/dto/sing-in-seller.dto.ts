import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignInSellerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  
}
