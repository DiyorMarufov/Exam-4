import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[a-zA-Z0-9]{3,30}$/, {
    message:
      'Name can only contain letters, spaces, and hyphens and length between 3 and 30',
  })
  name: string;

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

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
