import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((v) => Number(v));
        }
      } catch {}
      return value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((v) => Number(v.trim()));
    }
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    return [Number(value)];
  })
  imageIds: number[];
}
