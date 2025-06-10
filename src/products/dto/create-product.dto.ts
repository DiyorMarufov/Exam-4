import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDecimal,
  IsInt,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { deliveryoptions } from 'src/enums/delivery.options';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsEnum([
    deliveryoptions.PICKUP,
    deliveryoptions.COURIER,
    deliveryoptions.DIGITAL,
  ])
  @IsNotEmpty()
  delivery_options: deliveryoptions;

  // @IsInt()
  // @IsNotEmpty()
  // @Type(() => Number)
  // seller_id: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  category_id: number;
}
