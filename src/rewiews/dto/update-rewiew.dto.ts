import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-rewiew.dto';

export class UpdateRewiewDto extends PartialType(CreateReviewDto) {}
