import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  buyer_id: number;
}
