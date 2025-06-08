import { IsInt, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  cart_id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
