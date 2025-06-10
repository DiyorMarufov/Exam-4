import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  buyer_id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
