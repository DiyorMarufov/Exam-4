import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateSellerProfileDto {
  @IsInt()
  @IsNotEmpty()
  seller_id: number;

  @IsString()
  @IsNotEmpty()
  shop_name: string;

  @IsString()
  @IsNotEmpty()
  contact_info: string;
}
