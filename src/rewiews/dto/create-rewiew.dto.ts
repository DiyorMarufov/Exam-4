import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  buyer_id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
