import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class UserSingInDto {
  @IsEmail({}, { message: 'Please enter a valid email address!' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsPhoneNumber('UZ', { message: 'Please enter a valid phone number!' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

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
