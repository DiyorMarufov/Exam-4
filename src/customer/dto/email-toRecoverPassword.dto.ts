import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailToRecoverPassCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
