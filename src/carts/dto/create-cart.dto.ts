import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  buyer_id: string;
}
