import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  buyer_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
