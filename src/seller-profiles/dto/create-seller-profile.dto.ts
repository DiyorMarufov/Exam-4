import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSellerProfileDto {
  @IsNumber()
  @IsNotEmpty()
  seller_id: number;

  @IsEmail()
  @IsNotEmpty()
  shop_name: string;

  @IsString()
  @IsNotEmpty()
  contact_info: string;

  @IsString()
  @IsNotEmpty()
  avarage_rating: string;
}
