import { IsInt, IsNumber, IsNotEmpty,IsOptional } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  cart_id: number;

  @IsInt()
  @IsOptional()
  product_id?: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
