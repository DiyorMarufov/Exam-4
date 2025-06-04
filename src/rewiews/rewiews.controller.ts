import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RewiewsService } from './rewiews.service';
import { CreateReviewDto } from './dto/create-rewiew.dto';
import { UpdateRewiewDto } from './dto/update-rewiew.dto';

@Controller('rewiews')
export class RewiewsController {
  constructor(private readonly rewiewsService: RewiewsService) {}

  @Post()
  create(@Body() createRewiewDto: CreateReviewDto) {
    return this.rewiewsService.create(createRewiewDto);
  }

  @Get()
  findAll() {
    return this.rewiewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rewiewsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRewiewDto: UpdateRewiewDto,
  ) {
    return this.rewiewsService.update(id, updateRewiewDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rewiewsService.remove(id);
  }
}
