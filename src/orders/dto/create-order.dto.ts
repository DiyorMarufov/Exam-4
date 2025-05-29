import {
  IsInt,
  IsPhoneNumber,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
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
}