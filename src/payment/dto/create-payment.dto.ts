import { IsInt, IsNumber, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from '../../enums/payment-method';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  payment_method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  receipt_number: string;
}
