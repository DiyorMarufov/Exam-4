import { IsInt, IsNumber, IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsInt()
  @IsNotEmpty()
  reciept_nummber: number;

  @IsDate()
  @IsNotEmpty()
  paid_at: Date;
}
