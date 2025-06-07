import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class UserSignInDto {
  @IsEmail({}, { message: 'Please enter a valid email address!' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and two special characters.',
    },
  )
  password: string;
}
