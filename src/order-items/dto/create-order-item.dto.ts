import { IsInt, IsNotEmpty, IsOptional, IsDecimal } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  order_id: number;

  @IsInt()
  @IsOptional()
  product_id?: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
