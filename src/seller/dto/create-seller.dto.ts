import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Roles } from '../../enums';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEnum([Roles.SUPERADMIN, Roles.ADMIN, Roles.SELLER, Roles.CUSTOMER])
  role?: Roles.SELLER;

  @IsNotEmpty()
  @IsString()
  address: string;
}
