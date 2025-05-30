import {
  IsString,
  IsNotEmpty,
  IsDecimal,
  IsInt,
  IsEnum,
} from 'class-validator';
import { deliveryoptions } from 'src/enums/delivery.options';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsEnum([
    deliveryoptions.PICKUP,
    deliveryoptions.COURIER,
    deliveryoptions.DIGITAL,
  ])
  @IsNotEmpty()
  delivery_options: deliveryoptions;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsInt()
  @IsNotEmpty()
  seller_id: number;

  @IsInt()
  @IsNotEmpty()
  category_id: number;
}
