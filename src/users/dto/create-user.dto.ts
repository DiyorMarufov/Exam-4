import { IsString, IsNotEmpty, IsEnum, IsEmail,IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(['buyer'])
  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
