import { IsString, IsNotEmpty, IsNumber, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { deliveryoptions } from 'src/enums/delivery.options';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;

  @IsEnum(deliveryoptions)
  @IsNotEmpty()
  delivery_options: deliveryoptions;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  seller_id: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  category_id: number;
}
