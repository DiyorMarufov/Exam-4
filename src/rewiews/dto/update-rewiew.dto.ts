import { PartialType } from '@nestjs/mapped-types';
import { CreateRewiewDto } from './create-rewiew.dto';

export class UpdateRewiewDto extends PartialType(CreateRewiewDto) {}
