import {
  IsInt,
  IsPhoneNumber,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { orderStatus } from '../../enums/order-status';
import { deliveryMethod } from '../../enums/delivery-method';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  buyer_id: number;

  @IsEnum(orderStatus)
  @IsOptional()
  order_status: orderStatus = orderStatus.PENDING;

  @IsEnum(deliveryMethod)
  @IsNotEmpty()
  delivery_method: deliveryMethod;

  @IsString()
  @IsNotEmpty()
  delivery_address: string;

  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  contact_phone: string;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  cart_item_id: number[];
}
